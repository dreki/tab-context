import "./App.css";
// import { windowsAtom, IWindow } from "./stores";
import { observer } from "mobx-react";
import { WindowList } from "./components/WindowList";
import { Session, SessionStore } from "./stores/session";
import { WindowObserver } from "./stores/window";
import { onOurTabActivated } from "./utils/onOurTabActivated";
import { onOurWindowActivated } from "./utils/onOurWindowActivated";
import { suspend } from "./workflows/suspend";

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

const windowObserver = new WindowObserver();
const sessionStore: SessionStore = SessionStore.getInstance();

// Reload windows from store when our tab is activated.
onOurTabActivated({
    callback: async () => {
        await windowObserver.loadChromeWindows();
        await sessionStore.loadSessions();
    },
});

// Reload windows from store when our window is activated.
onOurWindowActivated({
    callback: async () => {
        await windowObserver.loadChromeWindows();
        await sessionStore.loadSessions();
    },
});

interface IAppProps {
    windowObserver: WindowObserver;
}

// function App(windowObserver: WindowObserver) {
const App = observer(function App({ windowObserver }: IAppProps) {
    return (
        <div className="container p-4">
            <h1 className="mt-4 mb-2 text-2xl font-bold">Windows</h1>
            <WindowList
                windows={windowObserver.windows}
                onSuspend={(window) => {
                    suspend(window);
                }}
            />

            <h1 className="mt-8 text-2xl font-bold">Sessions</h1>
            <SessionList sessions={sessionStore.sessions} />
        </div>
    );
});

const app = <App windowObserver={windowObserver} />;

export default app;
