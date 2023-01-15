
// On install, open 'ui.html' from within the extension. Open a new pinned tab in all windows.
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

export { };
