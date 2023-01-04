// import { IWindow } from "../stores";
import { TabList } from "./TabList";
import { Window } from "../stores/window";

interface WindowComponentProps {
  window: Window;
}

export function WindowComponent({ window }: WindowComponentProps) {
  return (
    <>
      <p>Window ID: {window.id}</p>
      <TabList tabs={window.tabs} />
    </>
  );
}
