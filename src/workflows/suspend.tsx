import { Session, SessionStore, Tab as SessionTab } from "../stores/session";
import { Tab, Window } from "../stores/window";

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
 * @param window The window to suspend.
 * @param name The name of the session.
 */
export async function suspend(window: Window, name: string) {
    // Reload all tabs in the window.
    // await reloadTabs(window.tabs, true);

    // Make a new `Session` from `window`'s tabs.
    // const session = new Session(window.tabs.map((tab) => tabToSessionTab(tab)));
    // const session = new Session(window.tabs);
    const session = new Session();
    session.name = name;
    session.tabs = window.tabs;
    console.log("> session:");
    console.log(session);
    // await SessionStore.save(session);
    await SessionStore.getInstance().save(session);
}
