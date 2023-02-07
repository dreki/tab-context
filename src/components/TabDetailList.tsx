import { ITab } from "../types/ITab";
import { TabDetailComponent } from "./TabDetailComponent";

interface TabDetailListProps {
    tabs: ITab[];
}

export function TabDetailList({ tabs }: TabDetailListProps) {
    if (!tabs) {
        console.log(`> tabs is null or undefined.`);
        return null;
    }
    return (
        <div className="flex flex-row flex-wrap gap-1.5">
            {tabs.map((tab, index) => {
                return (
                    <div key={index}>
                        <TabDetailComponent tab={tab} />
                    </div>
                );
            })}
        </div>
    );
}
