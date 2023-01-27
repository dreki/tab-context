import { WindowObserver } from "../stores/window";


// On install, open 'ui.html' from within the extension. Open a new pinned tab in all windows,
// unless there's already a tab open for this extension pinned.
chrome.runtime.onInstalled.addListener(() => {
    /*
        chrome.tabs.create({
        //url: "ui.html" });
        url: chrome.runtime.getURL("ui.html"),
        pinned: true,
    });
*/
    chrome.windows.getAll({ populate: true }, (windows) => {
        windows.forEach((window) => {
            // If the window is not a popup window
            if (!window.type || window.type === 'normal') {
                console.log(`> Checking window ${window.id}...`)
                if (!window.tabs) {
                    return;
                }
                // Check if there's already a pinned tab for this extension. See if it ends with
                // 'ui.html', and optionally has a query string.
                // const pinnedTab = window.tabs.find((tab) => tab.pinned && tab.url && tab.url.match(/ui\.html(\?.*)?$/));
                /*
                let pinnedTab = window.tabs.find((tab) => tab.pinned);
                // const pinnedTab = window.tabs.find((tab) => tab.pinned && tab.url === chrome.runtime.getURL('ui.html'));
                if (pinnedTab) {
                    console.log(`> Found pinned tab for this extension in window ${window.id}.`);
                    console.log(`> URL: ${pinnedTab.url}`);

                    return;
                }
                */

                // Find a tab for 'ui.html' in this extension. Ignore query parameters.
                const baseUrl = chrome.runtime.getURL('ui.html');
                const uiTab = window.tabs.find((tab) => tab.url && tab.url.startsWith(baseUrl));
                // console.log(`> uiTab: ${uiTab}`)
                if (uiTab) {
                    console.log(`> Found tab for this extension in window ${window.id}.`);
                    console.log(`> URL: ${uiTab.url}`);
                    return;
                }


                // Open a new pinned tab in the window
                chrome.tabs.create({
                    windowId: window.id,
                    url: chrome.runtime.getURL('ui.html'),
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
    console.log(`> Tab ${tabId} was moved to window ${moveInfo.windowId} at position ${moveInfo.toIndex}.`);
    
    // const windowObserverReloader = async () => {
    //     const windowObserver = new WindowObserver();
    //     await windowObserver.loadChromeWindows();
    // }

});

// Listen for tab order to change
chrome.tabs.onReplaced.addListener((addedTabId, removedTabId) => {
    console.log(`> Tab ${removedTabId} was replaced by tab ${addedTabId}.`);
});

export { };
