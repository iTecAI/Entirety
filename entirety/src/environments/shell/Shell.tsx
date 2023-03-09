import { AppShell, Group, Header, Navbar, Title } from "@mantine/core";
import { useTranslation } from "react-i18next";
import Logo from "../../assets/logo.svg";
import "./shell.scss";

export function Shell() {
    const { t } = useTranslation();
    return (
        <AppShell
            padding={"sm"}
            className="shell"
            navbar={
                <Navbar width={{ base: 300 }} p="xs" className="nav">
                    <></>
                </Navbar>
            }
            header={
                <Header height={60} p="xs" className="header">
                    <Group spacing={8}>
                        <img src={Logo} className="app-logo" />
                        <Title order={2} className="app-name">
                            {t("app")}
                        </Title>
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
