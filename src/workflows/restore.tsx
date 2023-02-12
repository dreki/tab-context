import { ITab } from "../types/ITab";

export async function restore(tabs: ITab[]) {
    console.log(`> restore()`);
    console.log(tabs);

    const urls = tabs.map((tab) => tab.url);

    console.log(`> urls:`);
    console.log(urls);

    // Create a window with all the tabs.
    const createdWindow: chrome.windows.Window = await chrome.windows.create({
        url: urls,
    });

    console.log(`> createdWindow:`);
    console.log(createdWindow);
    if (!createdWindow || !createdWindow.tabs) {
        console.warn("Unable to pin tabs in new window.");
        return;
    }
    // Go through new window's tabs, pinning ones that should be pinned.
    for (const tab of createdWindow.tabs) {
        if (!tab || !tab.id) {
            console.warn(
                "Unable to pin tab in new window due to missing tab ID."
            );
            continue;
        }
        // Match tabs by index in array.
        const matchingTab = tabs[tab.index];
        if (matchingTab && matchingTab.pinned) {
            await chrome.tabs.update(tab.id, { pinned: true });
        }
        /*
        const matchingTab = tabs.find((t) => t.url === tab.url);
        if (matchingTab && matchingTab.pinned) {
            await chrome.tabs.update(tab.id, { pinned: true });
        }
        */
    }

    // Pin tabs that have pinned: true.
    /* 
    const pinnedTabs = tabs.filter((tab) => tab.pinned);
    const pinnedTabIds = pinnedTabs.map((tab) => tab.id);
    console.log(`> pinnedTabIds:`);
    console.log(pinnedTabIds);
    // await chrome.tabs.update(pinnedTabIds, { pinned: true });
    for (const tabId of pinnedTabIds) {
        await chrome.tabs.update(tabId, { pinned: true });
    }
     */
}
