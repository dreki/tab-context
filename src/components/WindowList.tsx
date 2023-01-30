import { WindowComponent } from "./WindowComponent";
import { Window } from "../stores/window";
import { DivideChildren } from "../components/DivideChildren";

interface WindowListProps {
    windows: Window[];

    // A callback for when the user wants to save the window's current state to a session.
    // onSaveWindowToSession: (window: Window) => void;
    onSuspend: (window: Window) => void;
}

export function WindowList(props: WindowListProps) {
    // Log the IDs of all the windows
    // console.log("> Window IDs:");
    // console.log(props.windows.map((window) => window.id));

    // Render `WindowComponent`s in a `DivideChildren` component
    return (
        <>
            {props.windows.map((window, index) => {
                return (
                    <WindowComponent
                        key={index}
                        window={window}
                        onSuspend={props.onSuspend}
                    />
                );
            })}
        </>
    );
}
