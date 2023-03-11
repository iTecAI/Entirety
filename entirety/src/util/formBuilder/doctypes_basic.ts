import { IconMapping } from "../../components/Icon";
import { Renderable } from "./types";

export type CategoryName = "basic" | "character";

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
                type: "basic",
                id: "main",
                label: "Test Input",
            },
        ],
    },
};
