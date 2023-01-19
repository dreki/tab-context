// import { IWindow } from "../stores";
import { TabList } from "./TabList";
import { Window } from "../stores/window";

interface WindowComponentProps {
  window: Window;

  // A callback for when the user wants to save the window's current state to a session.
  onSaveWindowToSession: (window: Window) => void;
}

export function WindowComponent(props: WindowComponentProps) {
  return (
      <>
          <p>
              Window ID: {props.window.id} (index: {props.window.index})
          </p>
          <TabList tabs={props.window.tabs} />
          <button
              className="btn"
              onClick={() => props.onSaveWindowToSession(props.window)}
          >
              Save to session
          </button>
      </>
  );
}
