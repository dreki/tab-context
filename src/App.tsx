import "./App.css";
// import { windowsAtom, IWindow } from "./stores";
import { observer } from "mobx-react";
import { SessionList } from "./components/SessionList";
import { WindowList } from "./components/WindowList";
import { TabCollection, TabCollectionArray } from "./stores/closedTabs";
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
// let closedTabs: TabCollection[] = [];
let closedTabs: TabCollectionArray = [];

async function loadStores() {
    await windowObserver.loadChromeWindows();
    await sessionStore.loadSessions();
    // Look through windows, loading closed tabs via index.
    closedTabs = [];
    for (const window of windowObserver.windows) {
        // closedTabs.push(await TabCollection.loadClosedTabs(window.index));
        closedTabs[window.index] = await TabCollection.loadClosedTabs(
            window.index
        );
    }
}

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

async function onRestore(tabs: ITab[]) {
    await restore(tabs);
}

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
    );
});

// Listen for messages from the service worker.
// navigator.serviceWorker.addEventListener("message", (event) => {
//     console.log("Received message from service worker:", event.data);
// });
/* 
chrome.runtime.onMessage.addListener((message: IMessage): Promise<IResponse> => {
    // console.log("Received message from service worker:", message);

    const promise = new Promise<IResponse>((resolve, reject) => {
        const asyncFunction = async () => {
            const currentWindowId: Maybe<number> = await Window.getCurrentWindowId();
            if (currentWindowId === null) {
                reject("Could not get current window id");
                return;
            }
            if (currentWindowId === message.targetWindowId) {
                resolve({ success: true });
                return;
            }
            reject("Wrong window id");
        };

        asyncFunction();
    });

    return promise;
});
 */

chrome.runtime.onMessage.addListener(
    (message: IMessage): Promise<IResponse> => {
        // return {success: true} as IResponse;

        (async () => {
            await addMostRecentClosedTabToCollection(
                message,
                windowObserver,
                closedTabs
            );
            // // If the message is for this window and tab, then handle.
            // const currentWindowId: Maybe<number> =
            //     await Window.getCurrentWindowId();
            // const currentTabId: Maybe<number> = await getCurrentTabId();
            // if (
            //     currentWindowId !== message.targetWindowId ||
            //     currentTabId !== message.targetTabId
            // ) {
            //     return;
            // }
            // console.log(`> Received message from service worker: ${message}`);
            // // Find `Window` with matching ID.
            // const window: Maybe<Window> =
            //     windowObserver.windows.find(
            //         (window) => window.id === message.targetWindowId
            //     ) || null;
            // if (window === null) {
            //     return;
            // }
            // const closedTab: Maybe<ITab> = await fromMostRecentClosedTab();
            // if (closedTab === null) {
            //     return;
            // }
            // // Add to the list of `window`'s closed tabs.
            // /*
            // window.closedTabs.addTab(closedTab);
            // await window.closedTabs.save();
            //  */
            // const tabCollection: TabCollection = closedTabs[window.index];
            // tabCollection.addTab(closedTab);
            // await tabCollection.save();
        })();
        return Promise.resolve({ success: true } as IResponse);
    }
);

const app = <App windowObserver={windowObserver} />;

export default app;
