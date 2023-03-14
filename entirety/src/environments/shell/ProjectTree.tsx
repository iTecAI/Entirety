import { Button, Menu, Navbar, Paper, Stack, Text } from "@mantine/core";
import { ReactNode, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Icon } from "../../components/Icon";
import {
    CoreDocuments,
    DocumentTypeModel,
} from "../../util/formBuilder/doctypes_basic";
import {
    Document,
    useProject,
    useQuery,
    useTable,
} from "../../util/PersistentDb";
import "./tree.scss";

function ProjectCreationMenu(props: { target: ReactNode; parent: string }) {
    const { t } = useTranslation();
    const documents = useTable<Document>("documents");

    function createDocument(d: DocumentTypeModel) {
        documents.add({
            name: "New Document",
            icon: d.icon,
            tags: [],
            parent: props.parent,
            model: d.name,
            data: {},
        });
    }

    const contents = useMemo(() => {
        const categories: { [key: string]: DocumentTypeModel[] } = {};
        for (const doc of Object.values(CoreDocuments)) {
            const category = doc.category ?? "null";
            if (!Object.keys(categories).includes(category)) {
                categories[category] = [];
            }
            categories[category].push(doc);
        }

        return (
            <Menu.Dropdown>
                {categories.null &&
                    categories.null.map((v, i) => (
                        <Menu.Item
                            key={i}
                            icon={<Icon name={v.icon as any} />}
                            onClick={() => createDocument(v)}
                        >
                            {v.displayName}
                        </Menu.Item>
                    ))}
                {Object.keys(categories)
                    .filter((v) => v !== "null")
                    .map((c) => (
                        <>
                            <Menu.Label>
                                {t(`documents.categories.${c}`)}
                            </Menu.Label>
                            {categories[c].map((v, i) => (
                                <Menu.Item
                                    key={i}
                                    icon={<Icon name={v.icon as any} />}
                                    onClick={() => createDocument(v)}
                                >
                                    {v.displayName}
                                </Menu.Item>
                            ))}
                        </>
                    ))}
            </Menu.Dropdown>
        );
    }, []);
    return (
        <Menu shadow="md">
            <Menu.Target>{props.target}</Menu.Target>
            {contents}
        </Menu>
    );
}

export function ProjectTree() {
    const [manifest, setManifest] = useProject();
    const rootDocuments: Document[] = useQuery<Document>("documents", (table) =>
        table.where("parent").equals("").toArray()
    );
    const { t } = useTranslation();

    return (
        <Navbar.Section grow className="project-tree">
            {rootDocuments.length ? (
                <></>
            ) : (
                <Paper withBorder className="no-documents" p="sm">
                    <Stack spacing={"sm"}>
                        <Text size="md" className="text">
                            {t("documents.menu.noDocuments")}
                        </Text>
                        <ProjectCreationMenu
                            target={
                                <Button variant="light">
                                    {t("documents.menu.noDocumentsCreate")}
                                </Button>
                            }
                            parent={""}
                        />
                    </Stack>
                </Paper>
            )}
        </Navbar.Section>
    );
}
