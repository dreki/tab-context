import { ITab } from "../types/ITab";
import { TabDetailComponent } from "./TabDetailComponent";

interface TabDetailListProps {
    tabs: ITab[];
    onRestore: (tabs: ITab[]) => void;
}

export function TabDetailList({ tabs, onRestore }: TabDetailListProps) {
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

                <div className="card-actions mt-2">
                    <button
                        className="btn-primary btn-sm btn"
                        onClick={() => onRestore(tabs)}
                    >
                        Restore
                    </button>
                </div>
            </div>
        </div>
    );
}
