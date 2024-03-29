import { getExtensionUiTab, ITab } from "../types/ITab";
import { Maybe } from "../types/Maybe";
import { IMessage, MessageType } from "../types/Message";

/**
 * For a window, ensure that the main extension tab is open.
 *
 * @param window Window to check
 * @returns
 */
function ensureExtensionTabInWindow(
    window: chrome.windows.Window,
    onlyIfCurrentWindow: boolean = false,
    selectExtensionTab: boolean = true
) {
    // If not current window, then return. (There are service workers for each window, so we want to
    // avoid duplicate tabs.)
    chrome.windows.getCurrent((currentWindow) => {
        if (onlyIfCurrentWindow && currentWindow.id !== window.id) {
            return;
        }

        // If the window is not a popup window
        if (!window.type || window.type === "normal") {
            if (window.tabs) {
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
            }
            // Open a new pinned tab in the window
            chrome.tabs.create({
                windowId: window.id,
                url: chrome.runtime.getURL("ui.html"),
                pinned: true,
            });

            // If we were asked not to select the extension tab, select the second tab.
            if (!selectExtensionTab) {
                // Select the second tab in the window. (Selecting ours will be annoying for the user.)
                chrome.tabs.query({ windowId: window.id }, (tabs) => {
                    if (tabs.length > 1) {
                        const tab = tabs[1];
                        if (tab.id) {
                            chrome.tabs.update(tab.id, { active: true });
                        }
                    }
                });
            }
        }
    });
}

// On install, open 'ui.html' from within the extension. Open a new pinned tab in all windows,
// unless there's already a tab open for this extension pinned.
chrome.runtime.onInstalled.addListener(() => {
    chrome.windows.getAll({ populate: true }, (windows) => {
        windows.forEach((window) => {
            ensureExtensionTabInWindow(window);
        });
    });
});

// Whenever a new window is opened, ensure that the main extension tab is open.
chrome.windows.onCreated.addListener((window) => {
    ensureExtensionTabInWindow(window, true, false);
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

// When a tab is closed, add it to the list of recently closed tabs for the `Window`. Pass off to
// the extension's UI tab.
chrome.tabs.onRemoved.addListener(
    (tabId, removeInfo: chrome.tabs.TabRemoveInfo) => {
        // console.log(`> Tab ${tabId} was closed.`);
        // console.log(removeInfo);
        // return;

        (async () => {
            // If the window ID in removeInfo isn't the current window ID, then return;
            const currentWindow = await chrome.windows.getCurrent();
            if (!currentWindow) {
                console.log("> No current window found.");
            }
            if (!currentWindow || currentWindow.id !== removeInfo.windowId) {
                return;
            }
            // Get the tab for the extension's UI in the window that the tab was closed in.
            const extensionUiTab: Maybe<ITab> = await getExtensionUiTab(
                removeInfo.windowId
            );
            if (extensionUiTab) {
                // Send a message to the extension's UI tab to add the most recently closed tab.
                const message: IMessage = {
                    type: MessageType.AddMostRecentClosedTab,
                    targetWindowId: removeInfo.windowId,
                    targetTabId: extensionUiTab.id,
                };
                chrome.runtime.sendMessage(message);
            }
        })();
    }
);

export { };
