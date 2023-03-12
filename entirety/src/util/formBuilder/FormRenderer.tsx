import {
    Box,
    Group,
    MultiSelect,
    Select,
    Space,
    Stack,
    Text,
    TextInput,
} from "@mantine/core";
import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { createContext, useContext, useEffect, useMemo } from "react";
import { Icon } from "../../components/Icon";
import {
    BasicField,
    FieldTypes,
    FormatColumns,
    FormatTypes,
    RichTextField,
    SelectField,
} from "./types";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import { isEqual } from "lodash";

type FieldProps<T extends FieldTypes, V = any> = T & {
    value: V;
    onChange: (value: V) => void;
};

type FormValues = { [key: string]: any };

const FormContext = createContext<[FormValues, (values: FormValues) => void]>([
    {},
    () => {},
]);

export function useFormField<T>(id: string): {
    value: T;
    setValue: (value: T) => void;
} {
    const [form, setForm] = useContext(FormContext);
    return {
        value: form[id],
        setValue: (value) => setForm({ ...form, [id]: value }),
    };
}

class Fields {
    public static FieldMap = {
        basic: this.BasicField,
        select: this.SelectField,
        rich: this.RichTextField,
    };

    public static Field(props: { spec: FieldTypes }) {
        const spec = props.spec;
        const Element =
            Fields.FieldMap[spec.type as keyof typeof Fields.FieldMap];
        const { value, setValue } = useFormField<any>(spec.id);
        return <Element {...(spec as any)} value={value} onChange={setValue} />;
    }
    private static BasicField(
        props: FieldProps<BasicField, string>
    ): JSX.Element {
        return (
            <TextInput
                value={props.value ?? ""}
                onChange={(event) => props.onChange(event.target.value)}
                icon={
                    props.icon ? <Icon name={props.icon as any} /> : undefined
                }
                label={props.label}
                placeholder={props.placeholder}
            />
        );
    }

    private static SelectField(
        props: FieldProps<SelectField, string | string[]>
    ): JSX.Element {
        if (props.multiple) {
            return (
                <MultiSelect
                    value={(props.value as any) ?? []}
                    onChange={props.onChange}
                    icon={
                        props.icon ? (
                            <Icon name={props.icon as any} />
                        ) : undefined
                    }
                    label={props.label}
                    placeholder={props.placeholder}
                    searchable
                    data={props.options.map((v) => {
                        return { value: v, label: v };
                    })}
                />
            );
        } else {
            return (
                <Select
                    value={(props.value as string) ?? ""}
                    onChange={props.onChange as any}
                    icon={
                        props.icon ? (
                            <Icon name={props.icon as any} />
                        ) : undefined
                    }
                    label={props.label}
                    placeholder={props.placeholder}
                    searchable
                    data={props.options.map((v) => {
                        return { value: v, label: v };
                    })}
                />
            );
        }
    }

    private static RichTextField(props: FieldProps<RichTextField, any>) {
        const initialContent = useMemo(() => props.value ?? {}, []);
        const editor = useEditor({
            extensions: [
                StarterKit,
                Underline,
                Link,
                Superscript,
                SubScript,
                Highlight,
                TextAlign.configure({ types: ["heading", "paragraph"] }),
            ],
            content: initialContent,
            onUpdate: ({ editor }) => props.onChange(editor.getJSON()),
        });

        useEffect(() => {
            if (editor && !isEqual(props.value, editor.getJSON())) {
                editor.commands.setContent(props.value);
            }
        }, [props.value]);

        return (
            <Stack spacing={"sm"}>
                <Group spacing={"sm"}>
                    {props.icon && <Icon name={props.icon as any} size={24} />}
                    <Text size={"md"}>{props.label}</Text>
                </Group>
                <RichTextEditor editor={editor}>
                    <RichTextEditor.Toolbar sticky stickyOffset={60}>
                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Bold />
                            <RichTextEditor.Italic />
                            <RichTextEditor.Underline />
                            <RichTextEditor.Strikethrough />
                            <RichTextEditor.ClearFormatting />
                            <RichTextEditor.Highlight />
                            <RichTextEditor.Code />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.H1 />
                            <RichTextEditor.H2 />
                            <RichTextEditor.H3 />
                            <RichTextEditor.H4 />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Blockquote />
                            <RichTextEditor.Hr />
                            <RichTextEditor.BulletList />
                            <RichTextEditor.OrderedList />
                            <RichTextEditor.Subscript />
                            <RichTextEditor.Superscript />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Link />
                            <RichTextEditor.Unlink />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.AlignLeft />
                            <RichTextEditor.AlignCenter />
                            <RichTextEditor.AlignJustify />
                            <RichTextEditor.AlignRight />
                        </RichTextEditor.ControlsGroup>
                    </RichTextEditor.Toolbar>

                    <RichTextEditor.Content
                        style={{
                            minHeight: props.minHeight
                                ? `${props.minHeight}px`
                                : "384px",
                        }}
                    />
                </RichTextEditor>
            </Stack>
        );
    }
}

class Formatters {
    public static FormatterMap = {
        columns: this.ColumnsFormat,
    };

    public static Formatter(props: FormatTypes) {
        const Element =
            Formatters.FormatterMap[
                props.type as keyof typeof Formatters.FormatterMap
            ];
        return <Element {...props} />;
    }

    private static ColumnsFormat(props: FormatColumns) {
        return (
            <Group
                spacing={16}
                style={{
                    width: "calc(100% + 16px)",
                    alignItems: "self-start",
                }}
            >
                {props.fields.map((c, i) => (
                    <Box
                        key={i}
                        style={{
                            width: `calc(${100 / props.fields.length}% - 16px)`,
                        }}
                    >
                        {c.map((f, i) => (
                            <span key={i}>
                                <Fields.Field spec={f} />
                                <Space h={8} />
                            </span>
                        ))}
                    </Box>
                ))}
            </Group>
        );
    }
}

export function FormRenderer(props: {
    form: (FieldTypes | FormatTypes)[];
    values: FormValues;
    onChange: (values: FormValues) => void;
}) {
    return (
        <FormContext.Provider
            value={[props.values, (values) => props.onChange(values)]}
        >
            <Stack spacing={"sm"}>
                {props.form.map((v, i) => {
                    switch (v.supertype) {
                        case "field":
                            return <Fields.Field spec={v} key={i} />;
                        case "format":
                            return <Formatters.Formatter {...v} key={i} />;
                    }
                })}
            </Stack>
        </FormContext.Provider>
    );
}
