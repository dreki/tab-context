import { TabCollection } from "../stores/closedTabs";
import { Window, WindowObserver } from "../stores/window";
import { fromMostRecentClosedTab, getCurrentTabId, ITab } from "../types/ITab";
import { Maybe } from "../types/Maybe";
import { IMessage } from "../types/Message";

/**
 * Add the most recently closed tab to the correct tab collection.
 * @param message  Message from service worker
 * @param windowObserver  Window observer
 * @param collections  Tab collections. The correct one will be found, and the most recent closed tab will be added to it.
 * @returns  Nothing.
 */
export async function addMostRecentClosedTabToCollection(
    message: IMessage,
    windowObserver: WindowObserver,
    collections: TabCollection[]
) {
    /*
    // If the message is for this window and tab, then handle.
    const currentWindowId: Maybe<number> = await Window.getCurrentWindowId();
    const currentTabId: Maybe<number> = await getCurrentTabId();
    if (
        currentWindowId !== message.targetWindowId ||
        currentTabId !== message.targetTabId
    ) {
        return;
    }
    */
    // Find `Window` with matching ID.
    const window: Maybe<Window> =
        windowObserver.windows.find(
            (window) => window.id === message.targetWindowId
        ) || null;
    if (window === null) {
        console.log("window is null");
        return;
    }
    const closedTab: Maybe<ITab> = await fromMostRecentClosedTab();
    if (closedTab === null) {
        console.log("closedTab is null");
        return;
    }
    console.log("saving to collection")
    // Add to the list of `window`'s closed tabs.
    // const tabCollection: TabCollection = collections[window.index];
    const tabCollection: TabCollection = collections[window.index];
    console.log(tabCollection);
    
    tabCollection.addTab(closedTab);
    await tabCollection.save();
}

export async function addTabToCollection(
    tab: ITab,
    windowObserver: WindowObserver,
    collections: TabCollection[]
) {
    // If tab.windowId is null, log an error. This function should only be called
    // for real tabs that are in a window (not closed or suspended).
    if (tab.windowId === null) {
        console.error("tab.windowId is null");
        return;
    }
    // Find `Window` with matching ID.
    const window: Maybe<Window> =
        windowObserver.windows.find((window) => window.id === tab.windowId) ||
        null;
    if (window === null) {
        return;
    }
    // Add to the list of `window`'s closed tabs.
    const tabCollection: TabCollection = collections[window.index];
    tabCollection.addTab(tab);
    await tabCollection.save();
}

/**
 * Close a Chrome tab.
 */
export async function closeTab(tab: ITab) {
    chrome.tabs.remove(tab.id);
}
