import { useAtom } from "jotai";
import "./App.css";
import logo from "./logo.svg";
import { windowsAtom, IWindow } from "./stores";
import { WindowList } from "./components/WindowList";
import { observer } from "mobx-react";
import { Session } from "./stores/session";
import { useState, useEffect } from "react";

/**
 * Log all window IDs and the titles of their tabs. Log as JSON string.
 * @param windows Array of windows
 */
function logWindowsAndTabs(windows: IWindow[]) {
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

function App() {
  const [windows] = useAtom(windowsAtom);
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    const getSessions = async () => {
      const sessions = await Session.loadAll();
      setSessions(sessions || []);
    };
    getSessions();
  }, []);

  const addSessionButtonOnClick = async () => {
    const session = new Session();
    await session.save();
    setSessions([...sessions, session]);
  };

  return (
    <div className="p-2">
      <h1>Windows</h1>
      <WindowList windows={windows} />
      <h1>Sessions</h1>
      <SessionList sessions={sessions} />
      <button onClick={addSessionButtonOnClick}>Add Session</button>
    </div>
  );
}

export default observer(App);
