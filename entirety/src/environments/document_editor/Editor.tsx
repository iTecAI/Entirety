import {
    ActionIcon,
    Divider,
    Group,
    MultiSelect,
    SimpleGrid,
    Stack,
    TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdDelete, MdSave, MdTag } from "react-icons/md";
import { useParams } from "react-router-dom";
import { TagInput } from "../../components/TagInput";
import { CoreDocuments } from "../../util/formBuilder/doctypes_basic";
import { FormRenderer } from "../../util/formBuilder/FormRenderer";
import {
    Document,
    useDocument,
    useProject,
    useTable,
} from "../../util/PersistentDb";
import "./editor.scss";

function EditorArea(props: { doc: Document; save: (doc: Document) => void }) {
    const { doc, save } = props;
    const { t } = useTranslation();
    const form = useForm({
        initialValues: {
            name: doc ? doc.name : "",
            tags: doc ? doc.tags : [],
            content: doc ? doc.data : {},
        },
    });

    useMemo(() => {
        if (doc) {
            form.setValues({
                name: doc.name,
                tags: doc.tags,
                content: doc.data,
            });
        }
    }, [doc]);

    return (
        <Stack spacing="sm">
            <Group className="editor-buttons" spacing="xs">
                <ActionIcon
                    size="lg"
                    variant="light"
                    onClick={() =>
                        save({
                            ...(doc as Document),
                            name: form.values.name,
                            tags: form.values.tags,
                            data: form.values.content,
                        })
                    }
                >
                    <MdSave size={20} />
                </ActionIcon>
                <ActionIcon size="lg" variant="light">
                    <MdDelete size={20} />
                </ActionIcon>
            </Group>
            <Divider />
            <SimpleGrid cols={2} spacing="xs">
                <TextInput
                    withAsterisk
                    label={t("documents.editor.name")}
                    {...form.getInputProps("name")}
                />
                <TagInput
                    label={t("documents.editor.tags")}
                    {...form.getInputProps("tags")}
                />
            </SimpleGrid>
            <Divider />
            <FormRenderer
                form={doc ? CoreDocuments[doc.model].renderer : []}
                values={form.values["content"]}
                onChange={(values) => form.setFieldValue("content", values)}
            />
        </Stack>
    );
}

export function DocumentEditor() {
    const { id } = useParams();
    const [rendered, setRendered] = useState<ReactNode>(<></>);
    const [document, setDocument] = useState<null | Document>(null);
    const table = useTable<Document>("documents");

    useEffect(() => {
        table.get(Number(id)).then((v) => setDocument(v ?? null));
    }, [id]);

    return document ? (
        <EditorArea doc={document} save={(doc) => table.put(doc, doc.id)} />
    ) : (
        <></>
    );
}
