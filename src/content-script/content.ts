import localForage from "localforage";
import { ISaveWindowToSessionMessage, ISaveWindowToSessionResponse } from "../workflows/suspend";
import { v4 as uuidv4 } from 'uuid'

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

// Wait for document to load fully
document.addEventListener("DOMContentLoaded", () => {
    // See if the query string includes the session ID
    const urlParams = new URLSearchParams(window.location.search);
    const urlSessionId = urlParams.get("sessionId");
    // If it's missing, generate a new one via UUID
    if (!urlSessionId) {
        sessionId = uuidv4();
        // Redirect to ourselves, with the session ID in the query string
        window
            .location
            .assign(`${window.location.origin}${window.location.pathname}?sessionId=${sessionId}`);
    }
    else {
        // If the session ID is in the query string, save it.
        // console.log(`> Saving session ID: ${urlSessionId}`);
        sessionId = urlSessionId;
    }

    // console.log("> Content script loaded");
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
