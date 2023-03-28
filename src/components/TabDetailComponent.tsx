import { ITab } from "../types/ITab";
import { FavIconWithDefault } from "./FavIconWithDefault";

interface TabDetailComponentProps {
    tab: ITab;
    key?: number;
}

export function TabDetailComponent({ tab, key }: TabDetailComponentProps) {
    return (
        <li className="flex items-center space-x-3" key={key}>
            <FavIconWithDefault tab={tab} className={"h-5 w-5 flex-shrink-0"} />
            <span>{tab.title}</span>
        </li>
    );
}
