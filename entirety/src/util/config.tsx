import {
    BaseDirectory,
    createDir,
    readTextFile,
    writeTextFile,
    exists,
} from "@tauri-apps/api/fs";
import { appConfigDir } from "@tauri-apps/api/path";
import { defaultsDeep, join, set } from "lodash";
import {
    useState,
    useEffect,
    createContext,
    ReactNode,
    useContext,
} from "react";

export type RecentProject = {
    name: string;
    directory: string;
    lastOpened: number;
};

export type AppConfig = {
    recentProjects: RecentProject[];
};

const DefaultConfig: AppConfig = {
    recentProjects: [],
};

const ConfigContext = createContext<
    [Partial<AppConfig>, (key: string, value: any) => void]
>([{}, () => {}]);

export function useConfig(): [
    Partial<AppConfig>,
    (key: string, value: any) => void
] {
    const [config, update] = useContext(ConfigContext);
    return [config, update];
}

export function ConfigProvider(props: { children: ReactNode | ReactNode[] }) {
    const [config, setConfig] = useState<Partial<AppConfig>>({});

    async function loadConfig(): Promise<Partial<AppConfig>> {
        if (
            !(await exists("entirety.conf", { dir: BaseDirectory.AppConfig }))
        ) {
            await createDir(await appConfigDir(), {
                dir: BaseDirectory.Config,
                recursive: true,
            });
            await writeTextFile(
                "entirety.conf",
                JSON.stringify(DefaultConfig),
                { dir: BaseDirectory.AppConfig }
            );
        }

        const data: AppConfig = defaultsDeep(
            JSON.parse(
                await readTextFile("entirety.conf", {
                    dir: BaseDirectory.AppConfig,
                })
            ),
            DefaultConfig
        );
        return data;
    }

    useEffect(() => {
        loadConfig().then(setConfig);
    }, []);

    return (
        <ConfigContext.Provider
            value={[
                config,
                (key, value) => {
                    const result = set({ ...config }, key, value);
                    writeTextFile("entirety.conf", JSON.stringify(result), {
                        dir: BaseDirectory.AppConfig,
                    });
                    setConfig(result);
                },
            ]}
        >
            {props.children}
        </ConfigContext.Provider>
    );
}
