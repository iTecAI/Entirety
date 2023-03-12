import { useEffect, useState } from "react";
import { FormRenderer } from "../../util/formBuilder/FormRenderer";

export function PlaygroundPage() {
    const [formData, setFormData] = useState<any>({
        text: "",
        select: "",
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
            ]}
        />
    );
}
