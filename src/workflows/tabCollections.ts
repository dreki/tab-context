import { TabCollection } from "../stores/closedTabs";
import { Window, WindowObserver } from "../stores/window";
import { fromMostRecentClosedTab, getCurrentTabId, ITab } from "../types/ITab";
import { Maybe } from "../types/Maybe";
import { IMessage } from "../types/Message";

/**
 *
 * @param windowObserver WindowObserver instance to use.
 * @param targetWindowId
 * @param targetTabId
 * @param tabCollection
 * @returns
 */
// async function addMostRecentClosedTabToCollection(
//     targetWindowId: number,
//     targetTabId: number,
//     tabCollection: TabCollection
// ) {
//     const closedTab: Maybe<ITab> = await fromMostRecentClosedTab();
//     if (closedTab === null) {
//         return;
//     }
//     tabCollection.addTab(closedTab);
//     await tabCollection.save();
// }

export async function addMostRecentClosedTabToCollection(
    message: IMessage,
    windowObserver: WindowObserver,
    collections: TabCollection[]
) {
    // If the message is for this window and tab, then handle.
    const currentWindowId: Maybe<number> = await Window.getCurrentWindowId();
    const currentTabId: Maybe<number> = await getCurrentTabId();
    if (
        currentWindowId !== message.targetWindowId ||
        currentTabId !== message.targetTabId
    ) {
        return;
    }
    console.log(`> Received message from service worker: ${message}`);
    // Find `Window` with matching ID.
    const window: Maybe<Window> =
        windowObserver.windows.find(
            (window) => window.id === message.targetWindowId
        ) || null;
    if (window === null) {
        return;
    }
    const closedTab: Maybe<ITab> = await fromMostRecentClosedTab();
    if (closedTab === null) {
        return;
    }
    // Add to the list of `window`'s closed tabs.
    /*
            window.closedTabs.addTab(closedTab);
            await window.closedTabs.save();
             */
    const tabCollection: TabCollection = collections[window.index];
    tabCollection.addTab(closedTab);
    await tabCollection.save();
}
