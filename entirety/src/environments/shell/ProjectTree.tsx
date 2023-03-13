import { Button, Navbar, Paper, Stack, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useQuery, useRecord } from "../../util/db";
import { Document, Manifest } from "../../util/types";
import "./tree.scss";

export function ProjectTree() {
    const manifest: Manifest | null = useRecord("manifest", "manifest");
    const rootDocuments: Document[] = useQuery<Document>(
        "documents",
        (record) => record.parent === null
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
