import { IWindow } from "../stores";
import { WindowComponent } from "./WindowComponent";

interface WindowListProps {
  windows: IWindow[];
}

export function WindowList({ windows }: WindowListProps) {
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
