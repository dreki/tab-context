import localForage from "localforage";

localForage.config({
    name: "tab-context-content",
    storeName: "keyvaluepairs",
    version: 1.0,
    driver: localForage.LOCALSTORAGE,
});

console.log(`> Hello from content script`);

// Read the window session ID from local storage
localForage.getItem("session-id").then((value) => {
    console.log(`> Session ID: ${value}`);
});

// Listen for an event from the action script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(`> Received message from action script: ${message}`);
});

export { };
