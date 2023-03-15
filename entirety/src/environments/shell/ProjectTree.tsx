import {
    ActionIcon,
    Box,
    Button,
    Divider,
    Group,
    Menu,
    Navbar,
    Paper,
    Space,
    Stack,
    Text,
    useMantineTheme,
} from "@mantine/core";
import { ReactNode, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdAdd, MdExpandLess, MdExpandMore } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { Icon } from "../../components/Icon";
import {
    CoreDocuments,
    DocumentTypeModel,
} from "../../util/formBuilder/doctypes_basic";
import {
    Document,
    useDocument,
    useProject,
    useQuery,
    useTable,
} from "../../util/PersistentDb";
import "./tree.scss";

function ProjectCreationMenu(props: { target: ReactNode; parent: number }) {
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

function ProjectDocument(props: { id: number }) {
    const [doc] = useDocument(props.id);
    const { t } = useTranslation();
    const children = useQuery<Document>("documents", (table) =>
        table.where("parent").equals(props.id).toArray()
    );
    const [expanded, setExpanded] = useState<boolean>(false);
    const nav = useNavigate();
    const { id } = useParams();

    return (
        doc && (
            <Box>
                <Paper
                    p="sm"
                    className="document-item"
                    onClick={() => nav(`/p/doc/${props.id}`)}
                    style={
                        id && Number(id) === props.id
                            ? { backgroundColor: "#00000030" }
                            : undefined
                    }
                >
                    <Group spacing="sm">
                        {doc.icon && <Icon name={doc.icon as any} size={20} />}
                        <Text size="md">{doc.name}</Text>
                    </Group>
                    <Group className="action" spacing={2}>
                        <ProjectCreationMenu
                            target={
                                <ActionIcon
                                    radius="xl"
                                    className="create-child"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <MdAdd />
                                </ActionIcon>
                            }
                            parent={props.id}
                        />
                        {children.length > 0 && (
                            <ActionIcon
                                radius="xl"
                                className="create-child"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setExpanded(!expanded);
                                }}
                            >
                                {expanded ? <MdExpandLess /> : <MdExpandMore />}
                            </ActionIcon>
                        )}
                    </Group>
                </Paper>
                {expanded && <Space h={4} />}
                <Box
                    style={{ marginLeft: "8px" }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {expanded && (
                        <Stack spacing={4} className="child-box">
                            {children.map((v, i) => (
                                <ProjectDocument id={v.id as number} key={i} />
                            ))}
                        </Stack>
                    )}
                </Box>
            </Box>
        )
    );
}

export function ProjectTree() {
    const [manifest, setManifest] = useProject();
    const rootDocuments: Document[] = useQuery<Document>("documents", (table) =>
        table.where("parent").equals(-1).toArray()
    );
    const { t } = useTranslation();

    return (
        <>
            <Navbar.Section grow className="project-tree">
                {rootDocuments.length ? (
                    <Stack spacing="sm" className="document-list">
                        {rootDocuments.map((v, i) => (
                            <ProjectDocument id={v.id as number} key={i} />
                        ))}
                    </Stack>
                ) : (
                    <Paper withBorder className="no-documents" p="sm">
                        <Stack spacing={"sm"}>
                            <Text size="md" className="text">
                                {t("documents.menu.noDocuments")}
                            </Text>
                            <ProjectCreationMenu
                                target={
                                    <Button variant="light">
                                        {t("documents.menu.documentCreate")}
                                    </Button>
                                }
                                parent={-1}
                            />
                        </Stack>
                    </Paper>
                )}
            </Navbar.Section>
            {rootDocuments.length && (
                <Navbar.Section className="add-btn">
                    <Space h="sm" />
                    <Divider />
                    <Space h="sm" />
                    <ProjectCreationMenu
                        target={
                            <Button variant="light" style={{ width: "100%" }}>
                                {t("documents.menu.documentCreate")}
                            </Button>
                        }
                        parent={-1}
                    />
                </Navbar.Section>
            )}
        </>
    );
}
