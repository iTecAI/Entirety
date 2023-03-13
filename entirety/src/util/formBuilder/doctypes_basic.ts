import { IconMapping } from "../../components/Icon";
import { Renderable } from "./types";

export type CategoryName = "basic" | "character" | null;

export type DocumentTypeModel = {
    name: string;
    displayName: string;
    icon: keyof typeof IconMapping;
    category: CategoryName;
    renderer: Renderable;
};

export const CoreDocuments: { [key: string]: DocumentTypeModel } = {
    free: {
        name: "free",
        displayName: "Free-Form",
        icon: "MdArticle",
        category: "basic",
        renderer: [
            {
                supertype: "field",
                type: "rich",
                id: "main",
                label: "Document Content",
                icon: "MdArticle",
            },
        ],
    },
    folder: {
        name: "folder",
        displayName: "Folder",
        icon: "MdFolder",
        category: null,
        renderer: [
            {
                supertype: "field",
                type: "rich",
                id: "description",
                label: "Folder Description",
                icon: "MdArticle",
            },
        ],
    },
};
