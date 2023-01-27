import { Window } from "../stores/window";

/**
 * Log all window IDs and the titles of their tabs. Log as JSON string.
 * @param windows Array of windows
 */
export function logWindowsAndTabs(windows: Window[]) {
    const windowTabs: { tabs: { title: String }[] }[] = [];
    for (let window of windows) {
        if (!window.tabs) {
            continue;
        }
        const tabTitles: String[] = window.tabs.map(
            (tab) => tab.title
        ) as String[];
        windowTabs.push({ tabs: tabTitles.map((title) => ({ title })) });
    }
    console.log(JSON.stringify(windowTabs));
}
