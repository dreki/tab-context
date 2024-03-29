import { } from "../stores/window";
import { Maybe } from "./Maybe";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ITab {
    id: number;
    windowId?: number;
    title: string;
    pinned: boolean;
    // Group name and color are optional
    groupName?: string;
    groupColor?: string;
    url: string;
    favIconUrl?: string;
}

// ─── Functions ───────────────────────────────────────────────────────────────

/**
 * Make an `ITab` object from a Chrome tab.
 * @param tabId ID of the Chrome tab to use.
 * @returns The tab, as an `ITab` object, or `null` if the tab is not found.
 */
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
        group = await chrome.tabGroups.get(tab.groupId);
    }
    // If the tab is found, return it
    return {
        id: tabId,
        windowId: tab.windowId,
        title: tab.title || "",
        pinned: tab.pinned || false,
        url: tab.url || "",
        favIconUrl: tab.favIconUrl || "",
        groupName: group?.title || undefined,
        groupColor: group?.color || undefined,
    } as ITab;
}

/**
 * Make an `ITab` object from the most recently closed Chrome tab.
 * @returns The tab, as an `ITab` object, or `null` if the tab is not found.
 */
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
                    // TODO: Implement group data population
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

export async function getExtensionUiTab(
    windowId: number
): Promise<Maybe<ITab>> {
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

/**
 * Get the ID of the current tab.
 * @returns The ID of the current tab, or null if the current tab is not found.
 */
export async function getCurrentTabId(): Promise<Maybe<number>> {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs.length === 0) {
        return null;
    }
    return tabs[0].id || null;
}

export { };
