import { BaseDirectory, readTextFile, writeTextFile } from "@tauri-apps/api/fs";
import { appConfigDir } from "@tauri-apps/api/path";
import { exists } from "i18next";
import { defaultsDeep, join } from "lodash";
import {
    useState,
    useEffect,
    createContext,
    ReactNode,
    useContext,
} from "react";

type RecentProject = {
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

const ConfigContext = createContext<Partial<AppConfig>>({});

export function useConfig(): Partial<AppConfig> {
    const config = useContext(ConfigContext);
    return config;
}

export function ConfigProvider(props: { children: ReactNode | ReactNode[] }) {
    const [config, setConfig] = useState<Partial<AppConfig>>({});

    async function loadConfig(): Promise<Partial<AppConfig>> {
        const path = await join(await appConfigDir(), "entirety.conf");
        if (!(await exists(path))) {
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
        <ConfigContext.Provider value={config}>
            {props.children}
        </ConfigContext.Provider>
    );
}
