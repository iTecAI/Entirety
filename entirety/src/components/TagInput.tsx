import { MultiSelect, MultiSelectProps } from "@mantine/core";

export function TagInput(
    props: {
        value: string[];
        onChange: (value: string[]) => void;
    } & Partial<MultiSelectProps>
) {
    return (
        <MultiSelect
            {...props}
            searchable
            creatable
            onCreate={(q) => {
                return { value: q, label: q };
            }}
            onChange={props.onChange}
            value={props.value}
            data={props.value.map((v) => {
                return { value: v, label: v };
            })}
            getCreateLabel={(query) => "#" + query}
        />
    );
}
