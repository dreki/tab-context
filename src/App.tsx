import "./App.css";
import logo from "./logo.svg";
// import { windowsAtom, IWindow } from "./stores";
import { Window } from "./stores/window";
import { WindowList } from "./components/WindowList";
import { observer } from "mobx-react";
import { Session } from "./stores/session";
import { useState, useEffect } from "react";
import React from "react";

/**
 * Log all window IDs and the titles of their tabs. Log as JSON string.
 * @param windows Array of windows
 */
function logWindowsAndTabs(windows: Window[]) {
  const windowTabs: { tabs: { title: String }[] }[] = [];
  for (let window of windows) {
    if (!window.tabs) {
      continue;
    }
    const tabTitles: String[] = window.tabs.map((tab) => tab.title) as String[];
    windowTabs.push({ tabs: tabTitles.map((title) => ({ title })) });
  }
  console.log(JSON.stringify(windowTabs));
}

interface SessionComponentProps {
  session: Session;
}

const SessionComponent = observer(({ session }: SessionComponentProps) => {
  return (
    <div>
      <p>Session ID: {session.id}</p>
    </div>
  );
});

interface SessionListProps {
  sessions: Session[] | null;
}

// const SessionList = observer(() => {
// });
const SessionList = observer(({ sessions }: SessionListProps) => {
  if (!sessions) {
    return null;
  }
  return (
    <ul>
      {sessions.map((session, index) => {
        return (
          <li key={index}>
            <h2>Session</h2>
            <SessionComponent session={session} />
          </li>
        );
      })}
    </ul>
  );
});

/**
 * The state of the app.
 * @interface
 */
// interface IState {
//   windows: Window[];
//   sessions: Session[];
// }

/**
 * The main app component.
 * @class
 * @extends React.Component
 */
// class App extends React.Component {
//   // Initial state
//   state: IState = {
//     windows: [],
//     sessions: [],
//   };

//   render() {
//     return (
//       <div className="p-2">
//         <h1>Windows</h1>

//         <h1>Sessions</h1>
//       </div>
//     );
//   }
// }

function App() {
  const [windows, setWindows] = useState<Window[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    loadSessions();
    loadWindows();
  }, []);

  // console.log("> in useEffect, window IDs:");
  // console.log(windows.map((window) => window.id));

  const addSessionButtonOnClick = async () => {
    const session = new Session();
    await session.save();
    setSessions([...sessions, session]);
  };

  const onSaveWindowToSession = async (window: Window) => {
    const session = new Session();
    // Send message to all content scripts in all tabs in the window.
    const message = {
      type: "saveWindowToSession",
      payload: {
        sessionId: session.id,
      },
    };
    const tabs = window.tabs;

    // Hold reference to function here so that it can be used in the callback safely.
    const reloadFn = chrome.tabs.reload;

    // Reload the first three tabs and send message to them.
    const tabsToReload = tabs.slice(0, 3);
    for (let tab of tabsToReload) {
      chrome.tabs.query({ active: true, currentWindow: true }, (queryTabs) => {
        for (let queryTab of queryTabs) {
          // Don't reload the current tab.
          if (queryTab.id === tab.id) {
            continue;
          }
          // Reload the tab.
          reloadFn(tab.id);
        }
      });
    }
    // Wait until tabs are loaded.
    let tabsLoaded = 0;
    chrome.tabs.onUpdated.addListener(function listener(
      tabId,
      changeInfo,
      tab
    ) {
      if (changeInfo.status === "complete") {
        tabsLoaded++;
        // chrome.tabs.onUpdated.removeListener(listener);
        // console.log(`> tab ${tabId} is loaded`);
        // console.log(`> sending message to tab ${tabId}`);
        // chrome.tabs.sendMessage(tabId, message);
      }

      if (tabsLoaded === tabsToReload.length) {
        chrome.tabs.onUpdated.removeListener(listener);
        console.log(`> all tabs are loaded`);
        // sendMessageToTabs(tabsToReload, message);
        for (let tab of tabsToReload) {
          // Connect to the content script.
          // chrome.tabs.connect(tab.id);

          try {
            console.log(`> sending message to tab ${tab.id}`);
            // const result = await chrome.tabs.sendMessage(tab.id, message);
            let sessionId: any;
            chrome.tabs.sendMessage(tab.id, message).then((response) => {
              console.log(`> response:`);
              console.log(response);
              sessionId = sessionId;
            });
            // console.log(`> result:`);
            // console.log(result);
          } catch (error) {}
        }
      }
    });

    for (let tab of tabsToReload) {
      // Connect to the content script.
      // chrome.tabs.connect(tab.id);

      try {
        const result = await chrome.tabs.sendMessage(tab.id, message);
      } catch (error) {}
    }

    /* 
    // Reload first tab
    const tab = tabs[0];
    chrome.tabs.reload(tab.id);
    for (let tab of tabs) {
      // Tell Chrome to unsuspend the tab.
      // https://developer.chrome.com/docs/extensions/reference/tabs/#method-discard
      // https://developer.chrome.com/docs/extensions/reference/tabs/#method-undiscard

      // Connect to the content script.
      chrome.tabs.connect(tab.id);

      try {
        console.log(`> sending message to tab ${tab.id}`);
        const result = await chrome.tabs.sendMessage(tab.id, message);
        console.log(`> result:`);
        console.log(result);
      } catch (error) {
        console.log(`> error:`);
        console.log(error);
        debugger;
      }
    }
     */
  };

  return (
    <div className="p-2">
      <h1>Windows</h1>
      <WindowList
        windows={windows}
        onSaveWindowToSession={onSaveWindowToSession}
      />
      <h1>Sessions</h1>
      <SessionList sessions={sessions} />
      <button onClick={addSessionButtonOnClick}>Add Session</button>
    </div>
  );

  function loadWindows() {
    const getWindows = async () => {
      const windows = await Window.loadAll();
      console.log(`> windows:`);
      console.log(windows);
      setWindows(windows || []);
    };
    getWindows();
  }

  function loadSessions() {
    const getSessions = async () => {
      const sessions = await Session.loadAll();
      setSessions(sessions || []);
    };
    getSessions();
  }
}

export default observer(App);
