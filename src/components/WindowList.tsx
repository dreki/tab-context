import { WindowComponent } from "./WindowComponent";
import { Window } from "../stores/window";

interface WindowListProps {
  windows: Window[];
}

export function WindowList({ windows }: WindowListProps) {
  // Log the IDs of all the windows
  console.log("> Window IDs:");
  console.log(windows.map((window) => window.id));
  return (
    <ul>
      {windows.map((window, index) => {
        return (
          <li key={index}>
            <WindowComponent window={window} />
          </li>
        );
      })}
    </ul>
  );
}
