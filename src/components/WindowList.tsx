import { WindowComponent } from "./WindowComponent";
import { Window } from "../stores/window";

interface WindowListProps {
  windows: Window[];

  // A callback for when the user wants to save the window's current state to a session.
  // onSaveWindowToSession: (window: Window) => void;
  onSuspend: (window: Window) => void;
}

export function WindowList(props: WindowListProps) {
  // Log the IDs of all the windows
  console.log("> Window IDs:");
  console.log(props.windows.map((window) => window.id));
  return (
    <ul>
      {props.windows.map((window, index) => {
        return (
          <li key={index}>
            <WindowComponent
              window={window}
              onSuspend={props.onSuspend}
            />
          </li>
        );
      })}
    </ul>
  );
}
