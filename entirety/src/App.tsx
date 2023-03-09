import "./App.scss";
import { MantineProvider } from "@mantine/core";
import { PersistenceProvider } from "./util/persistence";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Shell } from "./environments/shell/Shell";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as en from "./localization/en.json";
import { ConfigProvider } from "./util/config";

i18n.use(initReactI18next) // passes i18n down to react-i18next
    .init({
        // the translations
        // (tip move them in a JSON file and import them,
        // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
        resources: {
            en: {
                translation: en,
            },
        },
        lng: "en", // if you're using a language detector, do not define the lng option
        fallbackLng: "en",

        interpolation: {
            escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
        },
    });

function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<Shell />}></Route>
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
                <PersistenceProvider>
                    <Router />
                </PersistenceProvider>
            </ConfigProvider>
        </MantineProvider>
    );
}

export default App;
