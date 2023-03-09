import {
    AppShell,
    Divider,
    Group,
    Header,
    Navbar,
    Space,
    Title,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import Logo from "../../assets/logo.svg";
import { SimpleMenu } from "../../components/SimpleMenu";
import "./shell.scss";
import { MdCreate, MdExitToApp, MdFileOpen, MdSettings } from "react-icons/md";
import { trigger_createProject } from "../../components/dialogs/CreateProjectModal";
import { useProject } from "../../util/persistence";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export function Shell() {
    const { t } = useTranslation();
    const [manifest, b, clear] = useProject();
    const nav = useNavigate();

    useEffect(() => {
        if (!manifest) {
            nav("/");
        }
    }, [manifest]);

    return (
        <AppShell
            padding={"sm"}
            className="shell"
            navbar={
                <Navbar width={{ base: 300 }} p="sm" className="nav">
                    <Navbar.Section grow className="project-tree">
                        <></>
                    </Navbar.Section>
                </Navbar>
            }
            header={
                <Header height={60} p="xs" className="header">
                    <Group spacing={8}>
                        <img src={Logo} className="app-logo" />
                        <Title order={2} className="app-name">
                            {t("app")}
                        </Title>
                        <Space w="md" />
                        <Divider orientation="vertical" />
                        <SimpleMenu
                            title={"shell.menus.project.title"}
                            options={[
                                {
                                    text: "shell.menus.project.new",
                                    icon: <MdCreate size={18} />,
                                    action: trigger_createProject,
                                },
                                {
                                    text: "shell.menus.project.open",
                                    icon: <MdFileOpen size={18} />,
                                },
                                "divider",
                                "shell.menus.project.sectionManagement",
                                {
                                    text: "shell.menus.project.settings",
                                    icon: <MdSettings size={18} />,
                                },
                                {
                                    text: "shell.menus.project.exit",
                                    icon: <MdExitToApp size={18} />,
                                    color: "red",
                                    action: () => clear(),
                                },
                            ]}
                        />
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
