import "./App.scss";
import { MantineProvider } from "@mantine/core";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ShellProjectCreate } from "./environments/shell/ShellCreate";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as en from "./localization/en.json";
import { ConfigProvider } from "./util/config";
import { ModalsProvider } from "@mantine/modals";
import { CreateProjectModal } from "./components/dialogs/CreateProjectModal";
import { Notifications } from "@mantine/notifications";
import { Shell } from "./environments/shell/ShellMain";
import { PlaygroundPage } from "./environments/playground/Playground";
import { PDBProvider } from "./util/PersistentDb";
import { DocumentEditor } from "./environments/document_editor/Editor";

i18n.use(initReactI18next).init({
    resources: {
        en: {
            translation: en,
        },
    },
    lng: "en",
    fallbackLng: "en",
    interpolation: {
        escapeValue: false,
    },
});

function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<ShellProjectCreate />} />
                <Route path="/p" element={<Shell />}>
                    <Route path="doc/:id" element={<DocumentEditor />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

function App() {
    return (
        <MantineProvider
            withCSSVariables
            withGlobalStyles
            withNormalizeCSS
            theme={{ colorScheme: "dark", fontFamily: "Roboto, sans-serif" }}
        >
            <ConfigProvider>
                <PDBProvider>
                    <Notifications />
                    <ModalsProvider
                        modals={{ createProject: CreateProjectModal }}
                    >
                        <Router />
                    </ModalsProvider>
                </PDBProvider>
            </ConfigProvider>
        </MantineProvider>
    );
}

export default App;
