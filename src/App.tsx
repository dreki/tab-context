import "./App.css";
// import { windowsAtom, IWindow } from "./stores";
import { observer } from "mobx-react";
import { WindowList } from "./components/WindowList";
import { Session } from "./stores/session";
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

// Reload windows from store when our tab is activated.
onOurTabActivated({
    onOurTabActivated: async () => {
        await windowObserver.loadChromeWindows();
        console.log("> windows reloaded");
    },
});

// Reload windows from store when our window is activated.
onOurWindowActivated({
    onOurWindowActivated: async () => {
        await windowObserver.loadChromeWindows();
        console.log("> windows reloaded");
    },
});

interface IAppProps {
    windowObserver: WindowObserver;
}

// function App(windowObserver: WindowObserver) {
const App = observer(function App({ windowObserver }: IAppProps) {
    return (
        <div className="p-2">
            <h1>Windows</h1>
            <WindowList
                windows={windowObserver.windows}
                onSuspend={(window) => {
                    suspend(window);
                }}
            />
        </div>
    );
});

const app = <App windowObserver={windowObserver} />;

export default app;
