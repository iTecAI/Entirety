import {
    AppShell,
    Divider,
    Group,
    Header,
    Input,
    Navbar,
    Paper,
    Space,
    Stack,
    Text,
    Title,
    useMantineTheme,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import Logo from "../../assets/logo.svg";
import { SimpleMenu } from "../../components/SimpleMenu";
import "./shell.scss";
import {
    MdCreate,
    MdDeveloperMode,
    MdEdit,
    MdExitToApp,
    MdFileOpen,
    MdSave,
    MdSettings,
} from "react-icons/md";
import { trigger_createProject } from "../../components/dialogs/CreateProjectModal";
import { Outlet, useNavigate } from "react-router-dom";
import { ProjectTree } from "./ProjectTree";
import { usePersistence, useProject } from "../../util/PersistentDb";
import { TitleMenu, useMenu } from "../../util/titlemenu";

export function Shell() {
    const { t } = useTranslation();
    const [manifest, setManifest] = useProject();
    const { clear, save } = usePersistence();
    const nav = useNavigate();
    const theme = useMantineTheme();
    useMenu(
        [
            {
                title: "shell.menus.project.title",
                options: [
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
                        text: "shell.menus.project.save",
                        icon: <MdSave size={18} />,
                        action: () => save(),
                    },
                    {
                        text: "shell.menus.project.exit",
                        icon: <MdExitToApp size={18} />,
                        color: "red",
                        action: () => {
                            clear();
                            nav("/");
                        },
                    },
                    {
                        text: "PLAYGROUND",
                        icon: <MdDeveloperMode size={18} />,
                        color: "red",
                        action: () => {
                            nav("/p/playground");
                        },
                    },
                ],
            },
        ],
        "/p"
    );

    return (
        <AppShell
            padding={"sm"}
            className="shell"
            navbar={
                <Navbar width={{ base: 300 }} p="sm" className="nav">
                    <Navbar.Section className="project-info">
                        {manifest ? (
                            <Paper
                                p="sm"
                                className="info-box"
                                shadow="md"
                                style={{
                                    backgroundColor: theme.colors.dark[8],
                                }}
                            >
                                <Stack spacing="sm">
                                    <Input
                                        variant="unstyled"
                                        className="project-name"
                                        value={manifest.name}
                                        icon={<MdEdit />}
                                        onChange={(event) =>
                                            setManifest({
                                                ...manifest,
                                                name: event.target.value,
                                            })
                                        }
                                    />
                                </Stack>
                            </Paper>
                        ) : (
                            <></>
                        )}
                    </Navbar.Section>
                    <Space h="sm" />
                    <Divider />
                    <Space h="sm" />
                    <ProjectTree />
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
                        <TitleMenu />
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
            <Outlet />
        </AppShell>
    );
}
