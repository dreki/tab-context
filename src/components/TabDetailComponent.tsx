import { ITab } from "../types/ITab";
import { FavIconWithDefault } from "./FavIconWithDefault";

interface TabDetailComponentProps {
    tab: ITab;
}

export function TabDetailComponent({ tab }: TabDetailComponentProps) {
    return (
        // Lay out a FavIconWithDefault to the left of tab.title.
        <div className="flex flex-row">
            <div>
                <FavIconWithDefault tab={tab} className={"align-middle"} />
            </div>
            <div>
                <div className="h-5 pl-1 align-middle">{tab.title}</div>
            </div>
        </div>
    );
}
