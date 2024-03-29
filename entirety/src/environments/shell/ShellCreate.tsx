import {
    ActionIcon,
    AppShell,
    Box,
    Button,
    Divider,
    Group,
    Header,
    Navbar,
    Paper,
    Space,
    Stack,
    Text,
    Title,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import Logo from "../../assets/logo.svg";
import { SimpleMenu } from "../../components/SimpleMenu";
import "./shell.scss";
import {
    MdCollectionsBookmark,
    MdCreate,
    MdFileOpen,
    MdOpenInNew,
} from "react-icons/md";
import { RecentProject, useConfig } from "../../util/config";
import { trigger_createProject } from "../../components/dialogs/CreateProjectModal";
import { useEffect, useMemo } from "react";
import { exists } from "@tauri-apps/api/fs";
import { useNavigate } from "react-router-dom";

import { requestScope } from "../../util/tauriInvoke";
import { usePersistence, useProject } from "../../util/PersistentDb";
import { TitleMenu, useMenu } from "../../util/titlemenu";

function RecentProjectItem(props: RecentProject) {
    const { load } = usePersistence();
    const [config, updateConfig] = useConfig();

    useMemo(() => {
        requestScope(props.directory).then(
            (v) =>
                v ||
                console.log(
                    `Failed to request scope access to ${props.directory}`
                )
        );
    }, []);

    useEffect(() => {
        if (config.recentProjects) {
            exists(props.directory).then((result) => {
                if (!result) {
                    updateConfig("recentProjects", [
                        ...(config.recentProjects as RecentProject[]).filter(
                            (v) => v.directory !== props.directory
                        ),
                    ]);
                }
            });
        }
    }, [props, config]);

    return (
        <Paper className="recent-project" shadow={"md"} p="md" withBorder>
            <MdCollectionsBookmark className="project-icon" size={20} />
            <Box className="text-container">
                <Text className="name" fz="lg">
                    {props.name}
                </Text>
                <Text className="edit" fz="xs" c="dimmed">
                    {new Date(props.lastOpened).toLocaleString()}
                </Text>
            </Box>
            <ActionIcon
                className="open-btn"
                variant="light"
                radius={"xl"}
                size="lg"
                color="blue"
                onClick={() => load(props.directory, props.name)}
            >
                <MdOpenInNew size={18} />
            </ActionIcon>
        </Paper>
    );
}

export function ShellProjectCreate() {
    const { t } = useTranslation();
    const [config] = useConfig();
    const [project] = useProject();
    const nav = useNavigate();
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
                ],
            },
        ],
        "/"
    );

    useEffect(() => {
        if (project) {
            nav("/p");
        }
    }, [project]);
    return (
        <AppShell
            padding={"sm"}
            className="shell"
            navbar={
                <Navbar width={{ base: 300 }} p="sm" className="nav">
                    <Navbar.Section grow className="recents">
                        <Stack spacing="sm">
                            <Text c="dimmed">
                                {t("shell.side.label.recent")}
                            </Text>
                            {config.recentProjects &&
                            config.recentProjects.length ? (
                                config.recentProjects
                                    .sort((a, b) => b.lastOpened - a.lastOpened)
                                    .map((v, i) => (
                                        <RecentProjectItem {...v} key={i} />
                                    ))
                            ) : (
                                <Paper
                                    className="recent-project no-recent"
                                    shadow={"sm"}
                                    p="md"
                                    withBorder
                                >
                                    {t("shell.side.noProject")}
                                </Paper>
                            )}
                        </Stack>
                    </Navbar.Section>
                    <Space h="sm" />
                    <Divider />
                    <Space h="sm" />
                    <Navbar.Section className="actions">
                        <Stack spacing="sm">
                            <Button
                                leftIcon={<MdCreate size={18} />}
                                variant="light"
                                onClick={trigger_createProject}
                            >
                                {t("shell.side.actions.new")}
                            </Button>
                            <Button
                                leftIcon={<MdFileOpen size={18} />}
                                variant="light"
                            >
                                {t("shell.side.actions.open")}
                            </Button>
                        </Stack>
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
            <img src={Logo} className="logo-large" />
        </AppShell>
    );
}

/*
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
    ]}
/>
*/
