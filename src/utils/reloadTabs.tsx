import { Tab } from "../stores/window";

/**
 * Reload Chrome tabs represented by `tabs`. Returns when all tabs are reloaded.
 * @param tabs Array of tabs to reload.
 */
export async function reloadTabs(
    tabs: Tab[],
    reloadCurrentTab: boolean = false
): Promise<void> {
    return new Promise((resolve, reject) => {
        // Hold reference to function here so that it can be used in the callback safely.
        const reloadFn = chrome.tabs.reload;
        let reloadPromises: Promise<void>[] = [];
        for (let tab of tabs) {
            chrome.tabs.query(
                { active: true, currentWindow: true },
                (queryTabs) => {
                    for (let queryTab of queryTabs) {
                        // Don't reload the current tab.
                        if (queryTab.id === tab.id && !reloadCurrentTab) {
                            continue;
                        }
                        // Reload the tab.
                        reloadPromises.push(reloadFn(tab.id));
                    }
                    // Wait for all tabs to reload.
                    Promise.all(reloadPromises).then(() => {
                        resolve();
                    });
                }
            );
        }
    });
}
