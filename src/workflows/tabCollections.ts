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
    // If the message is for this window and tab, then handle.
    const currentWindowId: Maybe<number> = await Window.getCurrentWindowId();
    const currentTabId: Maybe<number> = await getCurrentTabId();
    if (
        currentWindowId !== message.targetWindowId ||
        currentTabId !== message.targetTabId
    ) {
        return;
    }
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
    const tabCollection: TabCollection = collections[window.index];
    tabCollection.addTab(closedTab);
    await tabCollection.save();
}
