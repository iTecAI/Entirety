import { Group } from "@mantine/core";
import { matcher } from "glob-url";
import { isEqual } from "lodash";
import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { MenuDef, SimpleMenu } from "../components/SimpleMenu";

const MenuContext = createContext<[MenuDef[], (menus: MenuDef[]) => void]>(
    null as any
);

export function MenuProvider(props: { children: ReactNode | ReactNode[] }) {
    const [defs, setDefs] = useState<MenuDef[]>([]);

    return (
        <MenuContext.Provider value={[defs, setDefs]}>
            {props.children}
        </MenuContext.Provider>
    );
}

export function TitleMenu() {
    const [menu] = useContext(MenuContext);

    return (
        <Group spacing={4} className="top-menu">
            {menu.map((v, i) => (
                <SimpleMenu {...v} key={i} />
            ))}
        </Group>
    );
}

export function useMenu(defs: MenuDef[], match: string): void {
    const [menus, setMenus] = useContext(MenuContext);
    useMemo(() => {
        if (
            matcher.match(match, window.location.pathname) &&
            !isEqual(menus, defs)
        ) {
            setMenus(defs);
        }
    }, [match]);
}
