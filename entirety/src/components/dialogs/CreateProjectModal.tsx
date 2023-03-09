import { ContextModalProps, modals } from "@mantine/modals";
import { useTranslation } from "react-i18next";
import { useForm } from "@mantine/form";
import { ActionIcon, Button, Group, Stack, TextInput } from "@mantine/core";
import { MdCreate, MdFolder, MdFolderOpen } from "react-icons/md";
import { t } from "i18next";
import { open } from "@tauri-apps/api/dialog";
import { exists } from "@tauri-apps/api/fs";
import { notifications } from "@mantine/notifications";

export function CreateProjectModal({
    context,
    id,
    innerProps,
}: ContextModalProps<{ modalBody: string }>) {
    const { t } = useTranslation();
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
                    icon={<MdCreate />}
                />
                <TextInput
                    withAsterisk
                    label={t("dialogs.createProject.path")}
                    {...form.getInputProps("path")}
                    icon={<MdFolder />}
                    rightSection={
                        <ActionIcon
                            variant="light"
                            radius="xl"
                            onClick={() => {
                                open({
                                    directory: true,
                                    multiple: false,
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
                            <MdFolderOpen />
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
