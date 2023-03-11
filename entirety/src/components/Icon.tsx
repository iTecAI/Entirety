import * as GiIcons from "react-icons/gi";
import * as MdIcons from "react-icons/md";
import { IconBaseProps } from "react-icons";

export const IconMapping = {
    ...GiIcons,
    ...MdIcons,
};

export function Icon(
    props: { name: keyof typeof IconMapping } & Partial<IconBaseProps>
) {
    const DynamicIcon = IconMapping[props.name];
    return <DynamicIcon {...props} />;
}
