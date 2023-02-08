import "./App.css";
// import { windowsAtom, IWindow } from "./stores";
import { observer } from "mobx-react";
import { WindowList } from "./components/WindowList";
import { SessionStore } from "./stores/session";
import { WindowObserver } from "./stores/window";
import { onOurTabActivated } from "./utils/onOurTabActivated";
import { onOurWindowActivated } from "./utils/onOurWindowActivated";
import { suspend } from "./workflows/suspend";
import { SessionList } from "./components/SessionList";

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
        <div className="container p-8">
            <h1 className="mt-4 mb-4 text-2xl font-bold">Windows</h1>
            <WindowList
                windows={windowObserver.windows}
                onSuspend={(window) => {
                    suspend(window);
                }}
            />

            <h1 className="mt-8 mb-4 text-2xl font-bold">Sessions</h1>
            <SessionList sessions={sessionStore.sessions} />
        </div>
    );
});

const app = <App windowObserver={windowObserver} />;

export default app;
