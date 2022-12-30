import { IWindow } from "../stores";

interface WindowComponentProps {
  window: IWindow;
}

export function WindowComponent({ window }: WindowComponentProps) {
  return (
    <>
      <p>Window ID: {window.id}</p>
    </>
  );
}
