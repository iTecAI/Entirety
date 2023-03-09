import { AppShell, Group, Header, Navbar } from "@mantine/core";
import Logo from "../../assets/logo.svg";
import "./shell.scss";

export function Shell() {
    return (
        <AppShell
            padding={"sm"}
            className="shell"
            navbar={
                <Navbar width={{ base: 300 }} p="xs">
                    <></>
                </Navbar>
            }
            header={
                <Header height={60} p="xs" className="header">
                    <Group spacing={8}>
                        <img src={Logo} className="app-logo" />
                    </Group>
                </Header>
            }
            styles={(theme) => ({
                main: {
                    backgroundColor:
                        theme.colorScheme === "dark"
                            ? theme.colors.dark[8]
                            : theme.colors.gray[0],
                },
            })}
        >
            <></>
        </AppShell>
    );
}
