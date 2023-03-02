import { ITab } from "../types/ITab";
import { TabDetailComponent } from "./TabDetailComponent";

interface TabDetailListProps {
    tabs: ITab[];
    onRestore?: (tabs: ITab[]) => void;
}

export function TabDetailList({ tabs, onRestore }: TabDetailListProps) {
    if (!tabs) {
        return null;
    }
    // `restore` can be JSX or null
    const restore: JSX.Element | null = onRestore ? (
        <button
            className="btn-primary btn-sm btn"
            onClick={() => onRestore(tabs)}
        >
            Restore
        </button>
    ) : null;
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

                <div className="card-actions mt-2">{restore}</div>
            </div>
        </div>
    );
}
