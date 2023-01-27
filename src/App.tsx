import "./App.css";
// import { windowsAtom, IWindow } from "./stores";
import { observer } from "mobx-react";
import { WindowList } from "./components/WindowList";
import { Session } from "./stores/session";
import { WindowObserver } from "./stores/window";
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

// Listen for our tab to become activated
chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.getCurrent((tab) => {
        if (!tab) {
            return;
        }
        if (tab.id === activeInfo.tabId) {
            console.log("> Our tab activated");
            const updater = async () => {
                await windowObserver.loadChromeWindows();
                console.log("> windows reloaded");
            };
            updater();
        }
    });
    // console.log(`> Tab activated: ${activeInfo.tabId}`);
});

// Listen to on _window_ activation as well
chrome.windows.onFocusChanged.addListener((windowId) => {
    // If the focused window is our window, reload the windows data.
    // Otherwise, do nothing.
    chrome.windows.getCurrent((window) => {
        if (!window) {
            return;
        }
        if (window.id === windowId) {
            const updater = async () => {
                await windowObserver.loadChromeWindows();
                console.log("> windows reloaded");
            };
            updater();
        }
    });
});

// export default observer(App);

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
