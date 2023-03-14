import {
    createDir,
    exists,
    readBinaryFile,
    readDir,
    readTextFile,
    writeBinaryFile,
    writeTextFile,
} from "@tauri-apps/api/fs";
import { join } from "@tauri-apps/api/path";
import Dexie, { Table } from "dexie";
import { exportDB, importInto } from "dexie-export-import";
import { useLiveQuery } from "dexie-react-hooks";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { MAX_CHUNK_SIZE, VERSION } from "./constants";
import { requestScope } from "./tauriInvoke";

const TABLES = {
    documents: "++id, name, tags, parent",
};
const APPDB = "com.entirety.db";

export type Project = {
    name: string;
    version: string;
    lastUpdate: number;
};

export type Document = {
    id?: number;
    name: string;
    icon?: string;
    tags: string[];
    parent: number; // -1 if root
    model: string;
    data: { [key: string]: any };
};

export class TypedDexie extends Dexie {
    documents!: Table<Document>;

    constructor() {
        super(APPDB);
        this.version(1).stores(TABLES);
    }
}

export type PersistentDb = {
    db: TypedDexie;
    folder: string | null;
    project: Project | null;
    setProject: (p: Project) => void;
    setFolder: (f: string | null) => Promise<Project | null>;
    save: () => Promise<void>;
};

const PDBContext = createContext<PersistentDb>(null as unknown as PersistentDb);

export function PDBProvider(props: { children: ReactNode | ReactNode[] }) {
    const db = useMemo(() => new TypedDexie(), []);
    const [folder, setFolder] = useState<string | null>(null);
    const [project, setProject] = useState<Project | null>(null);

    async function setupProject(folder: string): Promise<Project> {
        await requestScope(folder);
        const p: Project = JSON.parse(
            await readTextFile(await join(folder, "project.json"))
        );
        const importBlobs: Blob[] = [];
        for (const f of (await readDir(folder))
            .filter((v) => v.path.endsWith(".db"))
            .sort(
                (a, b) =>
                    Number((a.name as string).split("_")[1].split(".")[0]) -
                    Number((b.name as string).split("_")[1].split(".")[0])
            )) {
            importBlobs.push(
                new Blob([
                    await readBinaryFile(await join(folder, f.name ?? "")),
                ])
            );
        }
        await db.documents.clear();
        if (importBlobs.length > 0) {
            await importInto(db, new Blob(importBlobs));
        }
        setProject(p);
        return p;
    }

    return (
        <PDBContext.Provider
            value={{
                db,
                folder,
                project,
                setProject,
                setFolder: async function (f) {
                    setFolder(f);
                    if (f) {
                        return await setupProject(f);
                    } else {
                        setProject(null);
                        return null;
                    }
                },
                save: async function () {
                    if (!project || !folder) {
                        throw new Error("No active project");
                    }
                    const exported = await exportDB(db);
                    const expSize = exported.size;
                    let ptr: number = 0;
                    let ct: number = 0;
                    while (true) {
                        const chunk = exported.slice(ptr, ptr + MAX_CHUNK_SIZE);
                        await writeBinaryFile(
                            await join(folder, `chunk_${ct}.db`),
                            await chunk.arrayBuffer()
                        );
                        ct++;
                        ptr += MAX_CHUNK_SIZE;
                        if (ptr > expSize) {
                            break;
                        }
                    }

                    await writeTextFile(
                        await join(folder, "project.json"),
                        JSON.stringify(project)
                    );
                },
            }}
        >
            {props.children}
        </PDBContext.Provider>
    );
}

type PersistentHook = {
    db: TypedDexie;
    load: (folder: string, name: string) => Promise<Project>;
    save: () => Promise<void>;
    clear: () => Promise<void>;
};
export function usePersistence(): PersistentHook {
    const context = useContext(PDBContext);
    return {
        db: context.db,
        load: async function (folder, name) {
            const path = await join(folder, name);
            if (!(await exists(path))) {
                await createDir(path);
                await writeTextFile(
                    await join(path, "project.json"),
                    JSON.stringify({
                        name,
                        version: VERSION,
                        lastUpdate: Date.now(),
                    })
                );
            }
            return (await context.setFolder(path)) as Project;
        },
        save: context.save,
        clear: async function () {
            await context.setFolder(null);
        },
    };
}

export function useProject(): [Project | null, (p: Project) => void] {
    const { project, setProject } = useContext(PDBContext);
    return [project, setProject];
}

export function useQuery<T>(
    table: keyof typeof TABLES,
    query: (table: Table<T>) => Promise<T[]>
): T[] {
    const { db } = useContext(PDBContext);
    const result = useLiveQuery(() => query(db[table] as any));
    return result ?? [];
}

export function useTable<T>(table: keyof typeof TABLES): Table<T> {
    const { db } = useContext(PDBContext);
    return db[table] as Table<T>;
}

export function useDocument(id: number): Document | null {
    const result = useQuery<Document>("documents", (t) =>
        t.where("id").equals(id).toArray()
    );

    return result[0] ?? null;
}
