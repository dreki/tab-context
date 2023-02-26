import { observer } from "mobx-react";
import { TabCollection } from "../stores/closedTabs";
import { Window } from "../stores/window";
import { WindowComponent } from "./WindowComponent";

interface WindowListProps {
    windows: Window[];
    closedTabs: TabCollection[];

    /**
     * A callback for when the user wants to save the window's current state to a session.
     * @param window  The window to suspend.
     * @returns  A promise that resolves when the window has been suspended.
     */
    onSuspend: (window: Window) => void;
}

/**
 * WindowList component. Renders a list of `WindowComponent`s for each `Window`.
 * @param {WindowListProps} props
 */
export const WindowList = observer(function WindowList(props: WindowListProps) {
    // Render `WindowComponent`s in a `DivideChildren` component
    return (
        <>
            {props.windows.map((window, index) => {
                return (
                    <WindowComponent
                        key={index}
                        window={window}
                        closedTabs={props.closedTabs[window.index]}
                        onSuspend={props.onSuspend}
                    />
                );
            })}
        </>
    );
});
