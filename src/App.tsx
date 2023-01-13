import "./App.css";
import logo from "./logo.svg";
// import { windowsAtom, IWindow } from "./stores";
import { Window } from "./stores/window";
import { WindowList } from "./components/WindowList";
import { observer } from "mobx-react";
import { Session } from "./stores/session";
import { useState, useEffect } from "react";
import React from "react";
import { onSaveWindowToSession } from "./workflows/saveWindowSession";

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
