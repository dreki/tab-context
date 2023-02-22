import { Maybe } from "./Maybe";
import { } from "../stores/window";

export interface ITab {
    id: number;
    title: string;
    pinned: boolean;
    // Group name and color are optional
    groupName?: string;
    groupColor?: string;
    url: string;
    favIconUrl?: string;
}

export async function fromChromeTab(tabId: number): Promise<Maybe<ITab>> {
    // Load the tab from Chrome
    const tab: Maybe<chrome.tabs.Tab> = await chrome.tabs.get(tabId);
    // If the tab is not found, return null
    if (!tab) {
        return null;
    }
    let group: Maybe<chrome.tabGroups.TabGroup> = null;
    // If tab has a groupId, get the group.
    if (tab.groupId !== -1) {
        group = await chrome.tabGroups.get(
            tab.groupId
        );
    }
    // If the tab is found, return it
    return {
        id: tabId,
        title: tab.title || "",
        pinned: tab.pinned || false,
        url: tab.url || "",
        favIconUrl: tab.favIconUrl || "",
        groupName: group?.title || undefined,
        groupColor: group?.color || undefined,
    } as ITab;

    // return {
    //     id: tabId,
    //     title: "",
    //     pinned: false,
    //     url: "",
    // };
}

export async function fromMostRecentClosedTab(): Promise<Maybe<ITab>> {
    // Create a Promise that will resolve when the tab is found.
    const promise = new Promise<Maybe<ITab>>((resolve) => {
        // Get the recently closed tabs
        chrome.sessions.getRecentlyClosed(async (sessions) => {
            // Iterate over each session
            for (let session of sessions) {
                // If the session is not a tab, continue
                if (session.tab === undefined) {
                    continue;
                }
                // If the session is a tab, resolve the promise and return.
                resolve({
                    id: session.tab.id,
                    title: session.tab.title || "",
                    pinned: session.tab.pinned || false,
                    url: session.tab.url || "",
                    favIconUrl: session.tab.favIconUrl || "",
                    // groupName: session.tab.groupName || undefined,
                    // groupColor: session.tab.groupColor || undefined,
                } as ITab);
                return;
            }
            // If the tab is not found, resolve the promise with null
            resolve(null);
        });
    });
    // Return the promise
    return promise;
}

/**
 * Use the chrome.sessions API to get a tab that was recently closed.
 * @param tabId ID of a tab that was recently closed.
 */
export async function fromClosedChromeTab(tabId: number): Promise<Maybe<ITab>> {
    // Create a Promise that will resolve when the tab is found.
    const promise = new Promise<Maybe<ITab>>((resolve) => {
        // Get the recently closed tabs
        chrome.sessions.getRecentlyClosed(async (sessions) => {
            // Iterate over each session
            for (let session of sessions) {
                console.log(`> session:`)
                console.log(session)
                // If the session is not a tab, continue
                if (session.tab === undefined) {
                    continue;
                }
                // console.log(`> ${session.tab.id} === ${tabId} ?`)
                // If the session is a tab, but the ID does not match, continue
                if (session.tab.id !== tabId) {
                    continue;
                }
                // If the session is a tab, and the ID matches, resolve the promise
                resolve({
                    id: tabId,
                    title: session.tab.title || "",
                    pinned: session.tab.pinned || false,
                    url: session.tab.url || "",
                    favIconUrl: session.tab.favIconUrl || "",
                    // groupName: session.tab.groupName || undefined,
                    // groupColor: session.tab.groupColor || undefined,
                } as ITab);
            }
            // If the tab is not found, resolve the promise with null
            resolve(null);
        });
    });
    // Return the promise
    return promise;

    // const sessions: chrome.sessions.Session[] = await chrome.sessions.getRecentlyClosed();
    // const sessions = await chrome.sessions.getRecentlyClosed({maxSessions: 100});
    // return null;
}

export async function getExtensionUiTab(windowId: number): Promise<Maybe<ITab>> {
    // const currentWindowId: Maybe<number> = await Window.

    // Get the Chrome tab for the extension's "ui.html" for the given window.
    const tabs: chrome.tabs.Tab[] = await chrome.tabs.query({
        url: chrome.runtime.getURL("ui.html"),
        windowId: windowId,
    });
    // If the tab is not found, return null
    if (tabs.length === 0) {
        return null;
    }
    // Make sure tab has a valid ID
    if (tabs[0].id === undefined) {
        return null;
    }
    // If the tab is found, return it
    return await fromChromeTab(tabs[0].id);

    /*
    const tabs = await chrome.tabs.query({ url: chrome.runtime.getURL("index.html") });
    if (tabs.length === 0) {
        return null;
    }
    return fromChromeTab(tabs[0].id);
    */
}

export { };
