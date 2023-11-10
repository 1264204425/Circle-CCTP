import { Select, SelectItem } from "@nextui-org/react";
import { Switch } from "@icon-park/react";

export default function SwitchNetwork() {
    return (
        <Select
            selectorIcon={<Switch theme="multi-color" size="20" fill={['#333', '#2F88FF', '#FFF', '#43CCF8']}
                                  strokeWidth={2} strokeLinecap="square"/>}
            label="Change Chain"
            size="sm"
            defaultSelectedKeys={["cat"]}
            className="w-20"
        >
            <SelectItem key={""}>
                11212
            </SelectItem>
        </Select>
    )
}