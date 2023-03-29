import { ChakraProvider } from "@chakra-ui/react";
import { observer } from "mobx-react";
import "./App.css";
import { SessionList } from "./components/SessionList";
import { WindowList } from "./components/WindowList";
import { TabCollection } from "./stores/closedTabs";
import { SessionStore } from "./stores/session";
import { WindowObserver } from "./stores/window";
import { ITab } from "./types/ITab";
import { IMessage, IResponse } from "./types/Message";
import { onOurTabActivated } from "./utils/onOurTabActivated";
import { onOurWindowActivated } from "./utils/onOurWindowActivated";
import { restore } from "./workflows/restore";
import { suspend } from "./workflows/suspend";
import { addMostRecentClosedTabToCollection } from "./workflows/tabCollections";

const windowObserver = new WindowObserver();
const sessionStore: SessionStore = SessionStore.getInstance();
let closedTabs: TabCollection[] = [];

// ─── Functions ───────────────────────────────────────────────────────────────

/**
 * Load all the stores we need.
 */
async function loadStores() {
    await windowObserver.loadChromeWindows();
    await sessionStore.loadSessions();
    // Look through windows, loading closed tabs via index.
    closedTabs = [];
    for (const window of windowObserver.windows) {
        closedTabs[window.index] = await TabCollection.loadClosedTabs(
            window.index
        );
    }
}

// ─── UI Action Handlers ──────────────────────────────────────────────────────

/**
 * Restore a session. UI handler.
 * @param tabs The tabs to restore.
 */
async function onRestore(tabs: ITab[]) {
    await restore(tabs);
}

// ─── Components ──────────────────────────────────────────────────────────────

interface IAppProps {
    windowObserver: WindowObserver;
}

/**
 * The main app component.
 */
const App = observer(function App({ windowObserver }: IAppProps) {
    return (
        <ChakraProvider>
            <div className="container p-8">
                <h1 className="mt-4 mb-4 text-2xl font-bold">Windows</h1>
                <WindowList
                    windows={windowObserver.windows}
                    closedTabs={closedTabs}
                    onSuspend={(window) => {
                        suspend(window);
                    }}
                />

                <h1 className="mt-8 mb-4 text-2xl font-bold">Sessions</h1>
                <SessionList
                    sessions={sessionStore.sessions}
                    onRestore={onRestore}
                />
            </div>
        </ChakraProvider>
    );
});

const app = <App windowObserver={windowObserver} />;

// ─── Message and Event Listeners ─────────────────────────────────────────────

// Reload windows from store when our tab is activated.
onOurTabActivated({
    callback: async () => {
        await loadStores();
    },
});

// Reload windows from store when our window is activated.
onOurWindowActivated({
    callback: async () => {
        await loadStores();
    },
});

// Listen for messages from the background script.
chrome.runtime.onMessage.addListener(
    (message: IMessage): Promise<IResponse> => {
        // return {success: true} as IResponse;

        (async () => {
            await addMostRecentClosedTabToCollection(
                message,
                windowObserver,
                closedTabs
            );
        })();
        return Promise.resolve({ success: true } as IResponse);
    }
);

// ─── Default Export ──────────────────────────────────────────────────────────

export default app;
