import { exists, readTextFile, writeFile } from "@tauri-apps/api/fs";
import { join } from "@tauri-apps/api/path";
import { isEqual, unset } from "lodash";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { v4 } from "uuid";
import { sleep } from "./fn";

export interface DBRecord {
    id: string;
}

type Query<T> = (record: T) => boolean;

export class DBTable<T extends DBRecord = any> {
    constructor(
        public name: string,
        public lastSave: number,
        public lastModification: number,
        public records: { [key: string]: T }
    ) {}

    private uuid(): string {
        return v4();
    }

    public serialize(): string {
        return JSON.stringify({
            name: this.name,
            lastSave: this.lastSave,
            lastModification: this.lastModification,
            records: this.records,
        });
    }

    public static load<T extends DBRecord = any>(serialized: string) {
        const data: DBTable<T> = JSON.parse(serialized);
        return new DBTable<T>(
            data.name,
            data.lastSave,
            data.lastModification,
            data.records
        );
    }

    public insert(doc: Omit<T, "id"> | T) {
        (doc as T).id = this.uuid();
        this.records[(doc as T).id] = doc as T;
        this.lastModification = Date.now();
    }

    public query(q: Query<T>): T[] {
        return Object.values(this.records).filter(q);
    }

    public specific(id: string): T | null {
        return this.records[id] ?? null;
    }

    public replace(q: Query<T>, data: Omit<T, "id"> | T, upsert?: boolean) {
        const results = this.query(q);
        if (results.length) {
            results.forEach((v) => {
                this.records[v.id] = { ...data, id: v.id } as T;
            });
        } else if (upsert) {
            this.insert(data);
        }
        this.lastModification = Date.now();
    }

    public delete(q: Query<T>) {
        const results = this.query(q);
        results.forEach((v) => unset(this.records, v.id));
        this.lastModification = Date.now();
    }
}

export class JSONDatabase {
    private tables: { [key: string]: DBTable };
    constructor(public folder: string) {
        this.tables = {};
    }

    public async save() {
        for (const t of Object.values(this.tables)) {
            if (t.lastModification > t.lastSave) {
                await writeFile(
                    await join(this.folder, `${t.name}.db`),
                    t.serialize()
                );
                t.lastSave = Date.now();
            }
        }
    }

    public async table<T extends DBRecord>(name: string): Promise<DBTable<T>> {
        if (!(await exists(await join(this.folder, `${name}.db`)))) {
            this.tables[name] = new DBTable<T>(name, -1, 0, {});
            this.save();
        } else if (!Object.keys(this.tables).includes(name)) {
            this.tables[name] = DBTable.load<T>(
                await readTextFile(await join(this.folder, `${name}.db`))
            );
        }
        return this.tables[name];
    }
}

const DBContext = createContext<
    [JSONDatabase | null, (folder: string) => JSONDatabase, () => void]
>([null, () => null as unknown as JSONDatabase, () => {}]);

export function DBProvider(props: { children: ReactNode | ReactNode[] }) {
    const [db, setDb] = useState<JSONDatabase | null>(null);

    return (
        <DBContext.Provider
            value={[
                db,
                (folder) => {
                    const created = new JSONDatabase(folder);
                    setDb(created);
                    return created;
                },
                () => setDb(null),
            ]}
        >
            {props.children}
        </DBContext.Provider>
    );
}

export function useDatabase(): [
    JSONDatabase | null,
    (folder: string) => JSONDatabase,
    () => void
] {
    const [db, init, clear] = useContext(DBContext);
    return [db, init, clear];
}

export function useTable<T extends DBRecord>(table: string): DBTable<T> | null {
    const [db] = useDatabase();
    const [result, setResult] = useState<DBTable<T> | null>(null);
    const [ltu, setLtu] = useState<string>("");

    //useEffect(() => console.log(result), [result]);
    useEffect(() => console.log(table, result, ltu), [table, result, ltu]);

    useEffect(() => {
        if (db) {
            if (table !== ltu) {
                db.table<T>(table).then((r) => {
                    setResult(r);
                    setLtu(table);
                });
            }
        } else {
            setResult(null);
            setLtu("");
        }
    }, [table, db]);
    return result;
}

export function useQuery<T extends DBRecord>(
    tableName: string,
    query: Query<T>
): T[] | null {
    const table = useTable<T>(tableName);
    const [result, setResult] = useState<T[] | null>(
        table ? table.query(query) : null
    );
    const tableRecords = table && table.records;

    useEffect(
        () => setResult(table ? table.query(query) : null),
        [table, tableRecords]
    );
    return result;
}
