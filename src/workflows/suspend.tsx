import { Session, SessionStore } from "../stores/session";
import { Window, WindowObserver } from "../stores/window";

function sessionIdFactory(): string {
    // Use base 36 to be more compact.
    return Math.random().toString(36).substring(2, 9);
}

export interface ISaveWindowToSessionMessage {
    type: "saveWindowToSession";
    payload: {
        // To use if a session ID doesn't exist already in the content script.
        generatedId: string;
    };
}

export interface ISaveWindowToSessionResponse {
    type: "saveWindowToSessionResponse";
    payload: {
        sessionId: string;
    };
}

/**
 * Convert a window tab to a session tab.
 *
 * @param tab The window tab to use to create a session tab.
 * @returns A session tab.
 */
/*
function tabToSessionTab(tab: Tab): SessionTab {
    return {
        title: tab.title,
        groupId: tab.groupId,
        url: tab.url,
        favIconUrl: tab.favIconUrl,
    } as SessionTab;
}
*/

/**
 * Syncs all tabs in the window to the session, and then closes the window.
 *
 * @param window The window to suspend.
 * @param windowObserver The window observer to use to close the window.
 * @param name The name of the session.
 * @param closeWindow Whether or not to close the window after suspending.
 */
export async function suspend(
    window: Window,
    windowObserver: WindowObserver,
    name: string,
    closeWindow?: boolean
) {
    // Make a new `Session` from `window`'s tabs.
    const session = new Session();
    session.name = name;
    // Set session.tabs to all the tabs in `window.tabs`, minus our extension's UI tab.
    session.tabs = window.tabs
        .filter((tab) => tab.url !== chrome.runtime.getURL("ui.html"))
    session.tabs = window.tabs;
    await SessionStore.getInstance().save(session);
    if (closeWindow) {
        // await chrome.windows.remove(window.id);
        await windowObserver.closeWindow(window.id);
    }
}
