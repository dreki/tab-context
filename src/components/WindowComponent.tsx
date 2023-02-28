// import { IWindow } from "../stores";
import { observer } from "mobx-react";
import { TabCollection } from "../stores/closedTabs";
import { Window } from "../stores/window";
import { TabList } from "./TabList";

interface WindowComponentProps {
    window: Window;
    closedTabs: TabCollection;

    /**
     * A callback for when the user wants to save the window's current state to a session.
     * @param window  The window to suspend.
     * @returns  A promise that resolves when the window has been suspended.
     */
    onSuspend: (window: Window) => void;
}

/**
 * WindowComponent component. Renders a `Window`.
 * @param {WindowComponentProps} props
 */
export const WindowComponent = observer(function WindowComponent(
    props: WindowComponentProps
) {
    /*
    let closedTabs =
        props.closedTabs?.tabs?.map((tab) => {
            return <li key={tab.id}>{tab.title}</li>;
        }) || null;
    */
    
    // Show "X Closed Tabs" if there are closed tabs, even if there are 0.
    let closedTabs = <>...</>;
    if (props.closedTabs) {
        closedTabs = (
            <p className="font-medium text-base">
                {props.closedTabs.tabs.length} Closed Tabs
            </p>
        );
    }
    return (
        <div className="card-bordered card card-compact mb-8 bg-slate-50 shadow-md">
            {/* Hidden h2, for accessibility, noting window */}
            <h2 className="sr-only">Window {props.window.index}</h2>
            <div className="overflow-hidden rounded-t-2xl bg-slate-200 p-2">
                {/* Hidden h3 to note tab list */}
                <h3 className="sr-only">Tab List</h3>
                <TabList tabs={props.window.tabs} />
            </div>
            <div className="card-body">
                <div>
                    {/* h3 SR only to note closed tabs label */}
                    <h3 className="sr-only">Closed Tabs</h3>
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
