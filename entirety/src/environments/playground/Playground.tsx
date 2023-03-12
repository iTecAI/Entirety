import { useEffect, useState } from "react";
import { FormRenderer } from "../../util/formBuilder/FormRenderer";

export function PlaygroundPage() {
    const [formData, setFormData] = useState<any>({
        text: "",
        select: "",
        tex1: "",
        tex2: "",
        tex3: "",
    });

    useEffect(() => console.log(formData), [formData]);

    return (
        <FormRenderer
            values={formData}
            onChange={setFormData}
            form={[
                {
                    supertype: "field",
                    type: "basic",
                    id: "text",
                    label: "Text Input",
                    icon: "MdPassword",
                    placeholder: "Enter Text",
                },
                {
                    supertype: "field",
                    type: "select",
                    id: "select",
                    label: "Selection",
                    icon: "MdSearch",
                    options: [
                        "Test1",
                        "Test2",
                        "Test3",
                        "Test4",
                        "Beans for the dark lord",
                    ],
                    multiple: true,
                },
                {
                    supertype: "format",
                    type: "columns",
                    fields: [
                        [
                            {
                                supertype: "field",
                                type: "basic",
                                id: "tex1",
                                label: "Text Input",
                                icon: "MdPassword",
                                placeholder: "Enter Text",
                            },
                            {
                                supertype: "field",
                                type: "basic",
                                id: "tex2",
                                label: "Text Input",
                                icon: "MdPassword",
                                placeholder: "Enter Text",
                            },
                            {
                                supertype: "field",
                                type: "basic",
                                id: "tex3",
                                label: "Text Input",
                                icon: "MdPassword",
                                placeholder: "Enter Text",
                            },
                        ],
                        [
                            {
                                supertype: "field",
                                type: "basic",
                                id: "tex2",
                                label: "Text Input",
                                icon: "MdPassword",
                                placeholder: "Enter Text",
                            },
                            {
                                supertype: "field",
                                type: "basic",
                                id: "tex3",
                                label: "Text Input",
                                icon: "MdPassword",
                                placeholder: "Enter Text",
                            },
                        ],
                        [
                            {
                                supertype: "field",
                                type: "basic",
                                id: "tex3",
                                label: "Text Input",
                                icon: "MdPassword",
                                placeholder: "Enter Text",
                            },
                        ],
                    ],
                },
            ]}
        />
    );
}
