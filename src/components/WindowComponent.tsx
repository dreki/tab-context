// import { IWindow } from "../stores";
import { observer } from "mobx-react";
import { TabCollection } from "../stores/closedTabs";
import { Window } from "../stores/window";
import { TabList } from "./TabList";

interface WindowComponentProps {
    window: Window;
    closedTabs: TabCollection;

    // A callback for when the user wants to save the window's current state to a session.
    //   onSaveWindowToSession: (window: Window) => void;
    onSuspend: (window: Window) => void;
}

// export function WindowComponent(props: WindowComponentProps) {
export const WindowComponent = observer(function WindowComponent(
    props: WindowComponentProps
) {
    // const closedTabs = props.window.closedTabs.tabs.map((tab) => {

    const closedTabs =
        props.closedTabs?.tabs?.map((tab) => {
            return <li key={tab.id}>{tab.title}</li>;
        }) || null;
    // console.log(`> WindowComponent, closedTabs: ${props.closedTabs}, closedTabs.tabs: ${props.closedTabs?.tabs}`)
    // const closedTabs = "";
    return (
        <div className="card-bordered card card-compact mb-8 bg-slate-50 shadow-md">
            {/* Hidden h2, for accessibility, noting window */}
            <h2 className="sr-only">Window {props.window.index}</h2>
            <div className="overflow-hidden rounded-t-2xl bg-slate-200 p-2">
                <TabList tabs={props.window.tabs} />
            </div>
            <div className="card-body">
                <div>
                    Window ID: {props.window.id} (index: {props.window.index})
                </div>
                <div>
                    <h3>Closed Tabs</h3>
                    <ul>{closedTabs}</ul>
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
