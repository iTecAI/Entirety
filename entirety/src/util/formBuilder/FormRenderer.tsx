import { Group, Select, Stack, TextInput } from "@mantine/core";
import { createContext, useContext } from "react";
import { Icon } from "../../components/Icon";
import {
    BasicField,
    FieldTypes,
    FormatColumns,
    FormatTypes,
    SelectField,
} from "./types";

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
    private static FieldMap = {
        basic: this.BasicField,
        select: this.SelectField,
    };

    public static Field(props: { spec: FieldTypes }) {
        const spec = props.spec;
        const Element = this.FieldMap[spec.type as keyof typeof this.FieldMap];
        const { value, setValue } = useFormField<any>(spec.id);
        return <Element {...(spec as any)} value={value} onChange={setValue} />;
    }
    private static BasicField(
        props: FieldProps<BasicField, string>
    ): JSX.Element {
        return (
            <TextInput
                value={props.value}
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
        props: FieldProps<SelectField, string>
    ): JSX.Element {
        return (
            <Select
                value={props.value}
                onChange={props.onChange}
                icon={
                    props.icon ? <Icon name={props.icon as any} /> : undefined
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

class Formatters {
    private static FormatterMap = {
        columns: this.ColumnsFormat,
    };

    public static Formatter(props: FormatTypes) {
        const Element =
            this.FormatterMap[props.type as keyof typeof this.FormatterMap];
        return <Element {...props} />;
    }

    private static ColumnsFormat(props: FormatColumns) {
        return (
            <Group spacing={"xs"}>
                {props.fields.map((c, i) => (
                    <Stack spacing={"xs"} key={i}>
                        {c.map((f, i) => (
                            <Fields.Field spec={f} key={i} />
                        ))}
                    </Stack>
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
            {props.form.map((v, i) => {
                switch (v.supertype) {
                    case "field":
                        return <Fields.Field spec={v} key={i} />;
                    case "format":
                        return <Formatters.Formatter {...v} key={i} />;
                }
            })}
        </FormContext.Provider>
    );
}
