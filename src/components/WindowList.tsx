import { IWindow } from "../stores";
import { WindowComponent } from "./WindowComponent";

interface WindowListProps {
  windows: IWindow[];
}

export function WindowList({ windows }: WindowListProps) {
  console.log("WindowList, windows:");
  console.log(windows);
  
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
