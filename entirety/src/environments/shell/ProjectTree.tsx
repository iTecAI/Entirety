import { Button, Navbar, Paper, Stack, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useProject, useQuery } from "../../util/PersistentDb";
import "./tree.scss";

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
                        <Button variant="light">
                            {t("documents.menu.noDocumentsCreate")}
                        </Button>
                    </Stack>
                </Paper>
            )}
        </Navbar.Section>
    );
}
