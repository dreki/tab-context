import { TabCollection } from "../stores/closedTabs";
import { fromMostRecentClosedTab, ITab, getExtensionUiTab } from "../types/ITab";
import { Maybe } from "../types/Maybe";
import { IMessage, IResponse, MessageType } from "../types/Message";

// On install, open 'ui.html' from within the extension. Open a new pinned tab in all windows,
// unless there's already a tab open for this extension pinned.
chrome.runtime.onInstalled.addListener(() => {
    chrome.windows.getAll({ populate: true }, (windows) => {
        windows.forEach((window) => {
            // If the window is not a popup window
            if (!window.type || window.type === "normal") {
                if (!window.tabs) {
                    return;
                }
                // Find a tab for 'ui.html' in this extension. Ignore query parameters.
                const baseUrl = chrome.runtime.getURL("ui.html");
                const uiTab = window.tabs.find(
                    (tab) => tab.url && tab.url.startsWith(baseUrl)
                );
                if (uiTab) {
                    console.log(
                        `> Found tab for this extension in window ${window.id}.`
                    );
                    console.log(`> URL: ${uiTab.url}`);
                    return;
                }
                // Open a new pinned tab in the window
                chrome.tabs.create({
                    windowId: window.id,
                    url: chrome.runtime.getURL("ui.html"),
                    pinned: true,
                });
            }
        });
    });
});

chrome.windows.onRemoved.addListener((windowId) => {
    console.log(`> Window ${windowId} was closed.`);
});

chrome.tabs.onMoved.addListener((tabId, moveInfo) => {
    console.log(
        `> Tab ${tabId} was moved to window ${moveInfo.windowId} at position ${moveInfo.toIndex}.`
    );
});

// Listen for tab order to change
chrome.tabs.onReplaced.addListener((addedTabId, removedTabId) => {
    console.log(`> Tab ${removedTabId} was replaced by tab ${addedTabId}.`);
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo: chrome.tabs.TabRemoveInfo) => {
    (async () => {
        const message: IMessage = {
            type: MessageType.AddMostRecentClosedTab,
            targetWindowId: removeInfo.windowId,
        };
        // If the window ID in removeInfo isn't the current window ID, then return;
        const currentWindow = await chrome.windows.getCurrent();
        if (!currentWindow) {
            console.log("> No current window found.");
        }
        if (!currentWindow || currentWindow.id !== removeInfo.windowId) {
            return;
        }
        console.log(`> Tab ${tabId} was closed (in window ${removeInfo.windowId})`);
        // Get the tab for the extension's UI in the window that the tab was closed in.
        const extensionUiTab = await getExtensionUiTab(removeInfo.windowId);
        console.log(`> Extension UI tab: ${extensionUiTab?.id}`);
        
        // TODO: Replace with a message send directly to our extension's tab for the window
        // await chrome.runtime.sendMessage(message);
    })();
});

// Listen for tabs closing, so we can remove them from the store.
// chrome.tabs.onRemoved.addListener(
//     (tabId, removeInfo: chrome.tabs.TabRemoveInfo) => {
//         console.log(`> Tab ${tabId} was closed.`);

//         // const closedTabs = TabCollection.loadClosedTabs(removeInfo.windowId);

//         // Create a function that allows us to call an async function from within a sync function.
//         // This is necessary because we can't use async/await in the callback function for
//         // chrome.tabs.onRemoved.addListener.
//         const asyncFunction = async () => {
//             const closedTabs = await TabCollection.loadClosedTabs(
//                 removeInfo.windowId
//             );
//             // const chromeTab: Maybe<ITab> = await fromChromeTab(tabId);
//             // TODO: Make this function just return the most recent closed tab, and use the window ID to associate it with the correct window.
//             // const chromeTab: Maybe<ITab> = await fromClosedChromeTab(tabId);
//             const chromeTab: Maybe<ITab> = await fromMostRecentClosedTab();
//             console.log("> chromeTab: ");
//             console.log(chromeTab);
//             if (!chromeTab) {
//                 return;
//             }
//             /*         const tab = await closedTabs.getTab(tabId);
//         if (tab) {
//             console.log(`> Tab ${tabId} was closed.`);
//             closedTabs.removeTab(tab);
//         } */
//             closedTabs.addTab(chromeTab);
//             await closedTabs.save();
//         };
//         // asyncFunction();

//         // Send a message to the content script to tell it to add the most recent closed tab to the window's closed tabs.
//         // chrome.tabs.sendMessage(tabId, { message: "addMostRecentClosedTab" }, (response) => {
//         //     console.log(response)
//         // });

//         // chrome.runtime.sendMessage({ message: "addMostRecentClosedTab" }, (response) => {
//         //     console.log(response)
//         // });
//         chrome.runtime.sendMessage(
//             {
//                 type: MessageType.AddMostRecentClosedTab,
//                 targetWindowId: removeInfo.windowId,
//             } as IMessage,
//             (response: IResponse) => {
//                 console.log("> Response:")
//                 console.log(response);
//             }
//         );
//     }
// );

export { };
