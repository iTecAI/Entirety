import {
    AppShell,
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
import { MdCreate, MdExitToApp, MdFileOpen, MdSettings } from "react-icons/md";
import { useConfig } from "../../util/config";
import { trigger_createProject } from "../../components/dialogs/CreateProjectModal";

export function Shell() {
    const { t } = useTranslation();
    const config = useConfig();
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
                                <></>
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
