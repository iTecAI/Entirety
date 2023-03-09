import "./App.scss";
import { MantineProvider } from "@mantine/core";
import { PersistenceProvider } from "./util/persistence";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Shell } from "./environments/shell/Shell";

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
            theme={{ colorScheme: "dark" }}
        >
            <PersistenceProvider>
                <Router />
            </PersistenceProvider>
        </MantineProvider>
    );
}

export default App;
