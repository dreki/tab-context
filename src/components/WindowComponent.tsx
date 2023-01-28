// import { IWindow } from "../stores";
import { TabList } from "./TabList";
import { Window } from "../stores/window";

interface WindowComponentProps {
    window: Window;

    // A callback for when the user wants to save the window's current state to a session.
    //   onSaveWindowToSession: (window: Window) => void;
    onSuspend: (window: Window) => void;
}

export function WindowComponent(props: WindowComponentProps) {
    return (
        <div className="mb-2">
            <div className="overflow-hidden">
                <TabList tabs={props.window.tabs} />
            </div>
            <div>
                Window ID: {props.window.id} (index: {props.window.index})
            </div>
            <button
                className="btn-primary btn-sm btn"
                onClick={() => props.onSuspend(props.window)}
            >
                Suspend
            </button>
        </div>
    );
}
