import localForage from "localforage";
import { ISaveWindowToSessionMessage, ISaveWindowToSessionResponse } from "../workflows/saveWindowSession";

localForage.config({
    name: "tab-context-content",
    storeName: "keyvaluepairs",
    version: 1.0,
    driver: localForage.LOCALSTORAGE,
});

// Read the window session ID from local storage
let sessionId: string | null = null;
localForage.getItem("session-id").then((value) => {
    sessionId = value as string;
});

// Listen for an event from the action script
chrome.runtime.onMessage.addListener((
    message: ISaveWindowToSessionMessage,
    sender,
    // sendResponse requires a param of ISaveWindowToSessionResponse
    sendResponse: (response: ISaveWindowToSessionResponse) => void
) => {
    console.log(`> Received message from action script:`);
    console.log(message);

    // If `sessionId` already holds an ID, return that.
    if (sessionId) {
        console.log(`> Returning existing session ID: ${sessionId}`);

        // sendResponse(sessionId);
        sendResponse({
            type: 'saveWindowToSessionResponse',
            payload: {
                sessionId: sessionId
            }
        });
        return;
    }
});

export { };
