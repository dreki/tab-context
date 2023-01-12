import localForage from "localforage";

localForage.config({
    name: "tab-context-content",
    storeName: "keyvaluepairs",
    version: 1.0,
    driver: localForage.LOCALSTORAGE,
});

console.log(`> Hello from content script`);

// Read the window session ID from local storage
let sessionId: string | null = null;
localForage.getItem("session-id").then((value) => {
    console.log(`> Session ID: ${value}`);
    sessionId = value as string;
});

// Listen for an event from the action script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(`> Received message from action script: ${message}`);

    // If `sessionId` already holds an ID, return that.
    if (sessionId) {
        console.log(`> Returning existing session ID: ${sessionId}`);

        sendResponse(sessionId);
        return;
    }
    // Otherwise, get the ID from the message, store it in local storage, and return it.
    sessionId = message;
    localForage.setItem("session-id", sessionId).then(() => {
        console.log(`> Returning new session ID: ${sessionId}`);
        sendResponse(sessionId);
    });
});

export { };
