import { ITab } from "../types/ITab";
import { TabComponent } from "./TabComponent";

interface TabListProps {
    tabs: ITab[];
}

export function TabList({ tabs }: TabListProps) {
    if (!tabs) {
        return null;
    }
    return (
        <div className="flex flex-row flex-wrap gap-1.5">
            {tabs.map((tab, index) => {
                return (
                    <div key={index}>
                        <TabComponent tab={tab} />
                    </div>
                );
            })}
        </div>
    );
}
