import { ITab } from "../types/ITab";

/**
 * Go through new window's tabs, pinning ones that should be pinned.
 *
 * @param createdWindow A Chrome window that was just created.
 * @param tabs The ITab tabs that were used to create the window.
 * @returns A promise that resolves when the tabs have been pinned.
 */
async function pinTabs(createdWindow: chrome.windows.Window, tabs: ITab[]) {
    if (!createdWindow || !createdWindow.tabs) {
        return;
    }
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
}

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
    await pinTabs(createdWindow, tabs);

    // Go through new window's tabs, getting IDs of ones that should be grouped, and the name and
    // color of the group.
    const tabsToGroup: {
        tabIds: number[];
        groupName: string;
        groupColor: string;
    }[] = [];
    for (const tab of createdWindow.tabs) {
        if (!tab || !tab.id) {
            console.warn(
                "Unable to group tab in new window due to missing tab ID."
            );
            continue;
        }
        // Match tabs by index in array.
        const matchingTab = tabs[tab.index];
        if (matchingTab && matchingTab.groupColor) {
            const group = tabsToGroup.find(
                (t) =>
                    t.groupName === matchingTab.groupName &&
                    t.groupColor === matchingTab.groupColor
            );
            if (group) {
                group.tabIds.push(tab.id);
            } else {
                tabsToGroup.push({
                    tabIds: [tab.id],
                    groupName: matchingTab.groupName || "",
                    groupColor: matchingTab.groupColor,
                });
            }
        }
    }
    // Go through tabs to group, grouping them.
    for (const tabGroup of tabsToGroup) {
        const groupId = await chrome.tabs.group({
            createProperties: {
                windowId: createdWindow.id,
            },
            tabIds: tabGroup.tabIds,
        });

        await chrome.tabGroups.update(groupId, {
            title: tabGroup.groupName,
            color: (tabGroup.groupColor ||
                "grey") as chrome.tabGroups.ColorEnum,
        });
        // await chrome.tabGroups.create({
        //     tabIds: tabGroup.tabIds,
        //     title: tabGroup.groupName,
        //     color: tabGroup.groupColor,
        // });
    }
}
