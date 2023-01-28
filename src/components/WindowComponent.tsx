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
        <div className="card bg-base-100 shadow-md">
            <div className="card-body">
                <h2 className="card-title">
                    Window ID: {props.window.id} (index: {props.window.index})
                </h2>
                <TabList tabs={props.window.tabs} />
                <div className="card-actions">
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
}
