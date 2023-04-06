import { observer } from "mobx-react";
import { ReactElement } from "react";
import { TabCollection } from "../stores/closedTabs";
import { ITab } from "../types/ITab";
import { TabDetailList } from "./TabDetailList";
import { TabList } from "./TabList";

interface MiniTabListProps {
    expanded: Boolean;
    tabs: ITab[];
    closedTabs: TabCollection;
    onCloseTab?: (tab: ITab) => void;
}

export const MiniTabList = observer(function MiniTabList(
    props: MiniTabListProps
) {
    let output: ReactElement | null = null;

    const handleTabClose = (tab: ITab) => {
        if (props.onCloseTab) {
            props.onCloseTab(tab);
        }
    };

    if (!props.expanded) {
        output = (
            <>
                {/* Hidden h3 to note tab list */}
                <h3 className="sr-only">Tab List</h3>
                <TabList tabs={props.tabs} />
            </>
        );
    }
    if (props.expanded) {
        output = (
            <div className="flex flex-row">
                <div className="basis-3/4">
                    {/* Hidden h3 to note tab list */}
                    <h3 className="sr-only">Tab List</h3>
                    <TabDetailList
                        onCloseTab={handleTabClose}
                        tabs={props.tabs}
                    />
                </div>
                <div className="basis-1/4">
                    <h3>Closed Tabs</h3>
                    <TabDetailList tabs={props.closedTabs.tabs} />
                </div>
            </div>
        );
    }
    return <>{output}</>;
});
