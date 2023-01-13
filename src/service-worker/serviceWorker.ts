
// On install, open 'ui.html' from within the extension.
chrome.runtime.onInstalled.addListener(() => {
    chrome.tabs.create({
        //url: "ui.html" });
        url: chrome.runtime.getURL("ui.html"),
        pinned: true,
    });
});

export { };
