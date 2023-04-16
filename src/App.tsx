import { observer } from "mobx-react";
import React from "react";
import "./App.css";
import {
    SessionCreationModal,
    Values as SessionCreationValues,
} from "./components/SessionCreationModal";
import { SessionList } from "./components/SessionList";
import { WindowList } from "./components/WindowList";
import { TabCollection } from "./stores/closedTabs";
import { SessionStore } from "./stores/session";
import { Window, WindowObserver } from "./stores/window";
import { ITab } from "./types/ITab";
import { IMessage, IResponse } from "./types/Message";
import { onOurTabActivated } from "./utils/onOurTabActivated";
import { onOurWindowActivated } from "./utils/onOurWindowActivated";
import { restore } from "./workflows/restore";
import { suspend } from "./workflows/suspend";
import {
    addMostRecentClosedTabToCollection,
    closeTab,
} from "./workflows/tabCollections";

const windowObserver = new WindowObserver();
const sessionStore: SessionStore = SessionStore.getInstance();
let closedTabs: TabCollection[] = [];

// ─── Functions ───────────────────────────────────────────────────────────────

/** Load all the stores we need. */
async function loadStores() {
    await windowObserver.loadChromeWindows();
    await sessionStore.loadActiveSessions();
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
 *
 * @param tabs The tabs to restore.
 */
async function onRestore(tabs: ITab[]) {
    await restore(tabs);
}

// ─── Components ──────────────────────────────────────────────────────────────

interface IAppProps {
    windowObserver: WindowObserver;
}

/** The main app component. */
const App = observer(function App({ windowObserver }: IAppProps) {
    const [showModal, setShowModal] = React.useState(false);
    const [windowForSession, setWindowForSession] =
        React.useState<Window | null>(null);

    const onSuspend = (window: Window) => {
        setShowModal(true);
        // suspend(window);
        setWindowForSession(window);
    };

    const onCloseWindow = async (window: Window) => {
        await windowObserver.closeWindow(window.id);
    };

    const onCreateSession = async (values: SessionCreationValues) => {
        // const onCreateSession = (w: Window) => async (values: SessionCreationValues) => {
        await suspend(windowForSession!, windowObserver, values.name, true);
        setShowModal(false);
    };

    return (
        <>
            <div className="container p-8">
                <h1 className="mt-4 mb-4 text-2xl font-bold">Windows</h1>
                <WindowList
                    windows={windowObserver.windows}
                    closedTabs={closedTabs}
                    onSuspend={onSuspend}
                    onCloseWindow={onCloseWindow}
                    onCloseTab={(tab) => {
                        // console.log("> Asked to close tab", tab);
                        closeTab(tab);

                        // addTabToCollection(tab, windowObserver, closedTabs);
                    }}
                />

                <h1 className="mt-8 mb-4 text-2xl font-bold">Sessions</h1>
                <SessionList
                    sessions={sessionStore.sessions}
                    onRestore={onRestore}
                />
            </div>

            {showModal && (
                <SessionCreationModal
                    onCancel={() => setShowModal(false)}
                    onCreate={onCreateSession}
                />
            )}
        </>
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
            // TODO: Remove this later to see if `observer` components are all functioning correctly. If they're not, and this is still required, that's fine too.
            await loadStores();
        })();
        return Promise.resolve({ success: true } as IResponse);
    }
);

// ─── Default Export ──────────────────────────────────────────────────────────

export default app;
