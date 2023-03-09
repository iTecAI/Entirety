import { Button, ButtonProps, Menu } from "@mantine/core";
import { isString } from "lodash";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export type MenuOption =
    | {
          text: string;
          icon?: JSX.Element;
          action?: () => void;
          color?: string;
      }
    | "divider"
    | string;

export type MenuDef = {
    title: string;
    icon?: JSX.Element;
    buttonProps?: Partial<ButtonProps>;
    options: MenuOption[];
};

export function SimpleMenu(props: MenuDef): JSX.Element {
    const { t } = useTranslation();
    const [open, setOpen] = useState<boolean>(false);

    return (
        <Menu opened={open} onChange={setOpen} position="bottom-start">
            <Menu.Target>
                <Button
                    variant="subtle"
                    leftIcon={props.icon ?? undefined}
                    {...(props.buttonProps ?? {})}
                    className="simple-menu trigger"
                    onClick={() => setOpen(!open)}
                >
                    {t(props.title)}
                </Button>
            </Menu.Target>
            <Menu.Dropdown style={{ zIndex: 500 }}>
                {props.options.map((item, i) => {
                    if (isString(item)) {
                        if (item === "divider") {
                            return <Menu.Divider key={i} />;
                        } else {
                            return <Menu.Label key={i}>{t(item)}</Menu.Label>;
                        }
                    } else {
                        return (
                            <Menu.Item
                                icon={item.icon ?? undefined}
                                onClick={item.action ?? (() => {})}
                                color={item.color ?? undefined}
                                key={i}
                            >
                                {t(item.text)}
                            </Menu.Item>
                        );
                    }
                })}
            </Menu.Dropdown>
        </Menu>
    );
}
