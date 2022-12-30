import { IWindow } from "../stores";
import { TabList } from "./TabList";

interface WindowComponentProps {
  window: IWindow;
}

export function WindowComponent({ window }: WindowComponentProps) {
  return (
    <>
      <p>Window ID: {window.id}</p>
      <TabList tabs={window.tabs} />
    </>
  );
}
