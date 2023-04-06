import { ITab } from "../types/ITab";
import { Maybe } from "../types/Maybe";
import { TabDetailComponent } from "./TabDetailComponent";

interface TabDetailListProps {
    tabs: ITab[];
    onRestore?: (tabs: ITab[]) => void;
    onCloseTab?: (tab: ITab) => void;
}


export function TabDetailList({
    tabs,
    onRestore,
    onCloseTab,
}: TabDetailListProps) {
    if (!tabs) {
        return null;
    }

    let handleTabClose: Maybe<(tab: ITab) => void> = null;
    if (onCloseTab) {
        handleTabClose = (tab: ITab) => {
            if (onCloseTab) {
                onCloseTab(tab);
            }
        }
    }

    return (
        <div className="m-2 rounded-lg">
            <ul className="mb-8 space-y-2 text-left dark:text-gray-400">
                {tabs.map((tab, index) => {
                    return (
                        <TabDetailComponent
                            tab={tab}
                            key={index}
                            onClose={handleTabClose}
                        />
                    );
                })}
            </ul>
        </div>
    );
}
