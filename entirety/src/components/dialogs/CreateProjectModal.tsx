import { ContextModalProps, modals } from "@mantine/modals";
import { useTranslation } from "react-i18next";
import { useForm } from "@mantine/form";
import { ActionIcon, Button, Group, Stack, TextInput } from "@mantine/core";
import { MdCreate, MdFolder, MdFolderOpen } from "react-icons/md";
import { t } from "i18next";
import { open } from "@tauri-apps/api/dialog";
import { createDir, exists, writeFile } from "@tauri-apps/api/fs";
import { notifications } from "@mantine/notifications";
import { join } from "@tauri-apps/api/path";
import { MAX_RECENT, VERSION } from "../../util/constants";
import { RecentProject, useConfig } from "../../util/config";
import { useProject } from "../../util/persistence";

async function buildProject(
    root: string,
    name: string
): Promise<RecentProject> {
    const rootPath = await join(root, name);
    await createDir(rootPath);
    await writeFile(
        await join(rootPath, "project.json"),
        JSON.stringify({
            name,
            lastOpened: Date.now(),
            version: VERSION,
        })
    );
    return {
        name,
        directory: rootPath,
        lastOpened: Date.now(),
    };
}

export function CreateProjectModal({
    context,
    id,
    innerProps,
}: ContextModalProps<{ modalBody: string }>) {
    const { t } = useTranslation();
    const [config, update] = useConfig();
    const [_, init] = useProject();
    const form = useForm({
        initialValues: {
            name: "New Project",
            path: "",
        },
        validate: {
            name: (value) =>
                value.length === 0
                    ? t("dialogs.createProject.nameError")
                    : null,
            path: (value) =>
                value.length === 0
                    ? t("dialogs.createProject.pathLengthError")
                    : null,
        },
    });
    return (
        <form
            onSubmit={form.onSubmit((values) => {
                exists(values.path)
                    .then((pathExists) => {
                        if (pathExists) {
                            context.closeModal(id);
                            buildProject(values.path, values.name).then(
                                (result) => {
                                    update(
                                        "recentProjects",
                                        [
                                            result,
                                            ...(config.recentProjects ?? []),
                                        ].slice(0, MAX_RECENT - 1)
                                    );
                                    init(result.directory);
                                }
                            );
                        } else {
                            notifications.show({
                                title: t("dialogs.createProject.pathError"),
                                message: t(
                                    "dialogs.createProject.pathErrorDetail",
                                    { folder: values.path }
                                ),
                                color: "red",
                            });
                        }
                    })
                    .catch(() =>
                        notifications.show({
                            title: t("dialogs.createProject.pathError"),
                            message: t(
                                "dialogs.createProject.pathErrorDetail",
                                { folder: values.path }
                            ),
                            color: "red",
                        })
                    );
            })}
        >
            <Stack spacing="sm">
                <TextInput
                    withAsterisk
                    label={t("dialogs.createProject.name")}
                    {...form.getInputProps("name")}
                    icon={<MdCreate size={18} />}
                />
                <TextInput
                    withAsterisk
                    label={t("dialogs.createProject.path")}
                    {...form.getInputProps("path")}
                    icon={<MdFolder size={18} />}
                    rightSection={
                        <ActionIcon
                            variant="light"
                            radius="xl"
                            onClick={() => {
                                open({
                                    directory: true,
                                    multiple: false,
                                    recursive: true,
                                }).then((result) => {
                                    if (result) {
                                        form.setFieldValue(
                                            "path",
                                            result as string
                                        );
                                    }
                                });
                            }}
                        >
                            <MdFolderOpen size={18} />
                        </ActionIcon>
                    }
                />
                <Group
                    spacing="xs"
                    style={{ marginRight: "0px", marginLeft: "auto" }}
                >
                    <Button
                        variant="light"
                        onClick={() => context.closeModal(id)}
                    >
                        {t("generic.cancel")}
                    </Button>
                    <Button variant="filled" type="submit">
                        {t("generic.finish")}
                    </Button>
                </Group>
            </Stack>
        </form>
    );
}

export function trigger_createProject() {
    modals.openContextModal({
        modal: "createProject",
        title: t("dialogs.createProject.title"),
        innerProps: {},
        centered: true,
    });
}
