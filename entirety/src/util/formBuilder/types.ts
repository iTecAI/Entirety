interface FieldBase {
    supertype: "field";
    type: string;
    id: string;
}

interface FormatBase {
    supertype: "format";
    type: string;
}

export interface BasicField extends FieldBase {
    type: "basic";
    label: string;
    icon?: string;
    placeholder?: string;
}

export interface SelectField extends FieldBase {
    type: "select";
    label: string;
    icon?: string;
    placeholder?: string;
    options: string[];
}

export interface FormatColumns extends FormatBase {
    type: "columns";
    fields: FieldTypes[][];
}

export type FieldTypes = BasicField | SelectField;
export type FormatTypes = FormatColumns;
export type Renderable = (FieldTypes | FormatTypes)[];
