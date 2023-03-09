import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useReducer,
    useState,
} from "react";
import {
    BaseDirectory,
    exists,
    readTextFile,
    writeTextFile,
} from "@tauri-apps/api/fs";
import { appConfigDir, join } from "@tauri-apps/api/path";
import { isArray } from "lodash";

export type ProjectManifest = {
    name: string;
    lastOpened: number;
    version: string;
};

export interface ProjectFile {
    uuid: string;
    parents: string[];
    displayName: string;
    displayIcon: string;
    children: string[];
}

export type PersistenceEnvironment = {
    root: string;
    manifest: ProjectManifest;
    cached: { [key: string]: ProjectFile };
} | null;

type PersistenceContextAction =
    | {
          type: "initialize";
          root: string;
      }
    | {
          type: "load";
          uuid: string | string[];
      }
    | {
          type: "clear";
      };

const PersistenceContext = createContext<
    [PersistenceEnvironment, (action: PersistenceContextAction) => void]
>([null, () => {}]);

export function PersistenceProvider(props: {
    children: ReactNode | ReactNode[];
}) {
    async function updateEnvironment(
        state: PersistenceEnvironment,
        action: PersistenceContextAction
    ): Promise<PersistenceEnvironment> {
        switch (action.type) {
            case "initialize":
                /*if (state) {
                    Object.values(state.cached).map((v) => v && v.save());
                }*/
                if (!(await exists(await join(action.root, "project.json")))) {
                    throw new Error(
                        `Could not load project ${action.root}, no project.json found.`
                    );
                }
                const manifestRaw = await readTextFile(
                    await join(action.root, "project.json")
                );
                const parsed = JSON.parse(manifestRaw);
                return {
                    root: action.root,
                    manifest: parsed,
                    cached: {},
                };
            case "load":
                if (state) {
                    let uuid: string[] = action.uuid as string[];
                    if (!isArray(action.uuid)) {
                        uuid = [uuid as unknown as string];
                    }
                    for (const v of uuid) {
                        if (
                            !Object.keys(state.cached).includes(v) &&
                            (await exists(
                                await join(state.root, action.uuid + ".json")
                            ))
                        ) {
                            state.cached[v] = JSON.parse(
                                await readTextFile(
                                    await join(
                                        state.root,
                                        action.uuid + ".json"
                                    )
                                )
                            );
                        }
                    }
                    return { ...state };
                } else {
                    throw new Error("Persistence not initialized.");
                }
            case "clear":
                return null;
        }
    }

    const [env, setEnv] = useState<PersistenceEnvironment>(null);
    return (
        <PersistenceContext.Provider
            value={[
                env,
                (action) => updateEnvironment(env, action).then(setEnv),
            ]}
        >
            {props.children}
        </PersistenceContext.Provider>
    );
}

export function usePersistent<T extends ProjectFile>(uuid: string): T | null {
    const [persistence, dispatch] = useContext(PersistenceContext);

    useEffect(() => {
        if (persistence) {
            dispatch({ type: "load", uuid });
        }
    }, [uuid, persistence]);

    if (persistence) {
        return (persistence.cached[uuid] as T) ?? null;
    } else {
        return null;
    }
}

export function useProject(): [ProjectManifest | null, (root: string) => void] {
    const [persistence, dispatch] = useContext(PersistenceContext);

    return [
        persistence ? persistence.manifest : null,
        (root) => dispatch({ type: "initialize", root }),
    ];
}
