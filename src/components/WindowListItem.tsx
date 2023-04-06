import { observer } from "mobx-react";
import { useState } from "react";
import { TabCollection } from "../stores/closedTabs";
import { Window } from "../stores/window";
import { ITab } from "../types/ITab";
import { MiniTabList } from "./MiniTabList";

/**
 * WindowComponentProps interface. Props for the `WindowComponent` component.
 */
interface WindowListItemProps {
    window: Window;
    closedTabs: TabCollection;

    /**
     * A callback for when the user wants to save the window's current state to a session.
     * @param window  The window to suspend.
     * @returns  A promise that resolves when the window has been suspended.
     */
    onSuspend: (window: Window) => void;

    /**
     * A callback for when a user wants to close a tab.
     * @param tab  The tab to close.
     */
    onCloseTab?: (tab: ITab) => void;
}

/**
 * WindowComponent component. Renders a `Window`.
 * @param {WindowListItemProps} props
 */
export const WindowListItem = observer(function WindowListItem(
    props: WindowListItemProps
) {
    const [expand, setExpand] = useState<Boolean>(false);

    // Show "X Tabs" for the amount of open tabs in the window.
    let openTabs = (
        <span className="text-base font-medium">
            {props.window.tabs.length} Tabs
        </span>
    );

    // Show "X Closed Tabs" if there are closed tabs, even if there are 0.
    let closedTabs = <>...</>;
    if (props.closedTabs) {
        closedTabs = (
            <span className="text-base">
                {props.closedTabs.tabs.length} Closed Tabs
            </span>
        );
    }
    return (
        <div className="card-bordered card card-compact mb-8 bg-slate-50 shadow-md">
            {/* Hidden h2, for accessibility, noting window */}
            <h2 className="sr-only">Window {props.window.index}</h2>
            <div className="overflow-hidden rounded-t-2xl bg-slate-200 p-2">
                <div className="">
                    <MiniTabList
                        expanded={expand}
                        tabs={props.window.tabs}
                        closedTabs={props.closedTabs}
                        onCloseTab={props.onCloseTab}
                    />
                    {/* When clicking button, flip `expand` */}
                    <div className="grid place-items-center">
                        <button
                            className="btn-ghost btn-xs btn"
                            onClick={() => setExpand(!expand)}
                        >
                            Click to expand
                        </button>
                    </div>
                </div>
            </div>
            <div className="card-body">
                <div>
                    {openTabs}
                    <span className="ml-2 mr-2 text-gray-400">|</span>
                    {closedTabs}
                </div>
                <div className="card-actions mt-2">
                    <button
                        className="btn-primary btn-sm btn"
                        onClick={() => props.onSuspend(props.window)}
                    >
                        Suspend
                    </button>
                </div>
            </div>
        </div>
    );
});
