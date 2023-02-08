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
        <div className="card-bordered card card-compact mb-4 bg-purple-100 shadow-md">
            <div className="card-body">
                {tabs.map((tab, index) => {
                    return (
                        <div key={index}>
                            <TabDetailComponent tab={tab} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
