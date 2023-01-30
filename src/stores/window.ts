import { makeAutoObservable } from "mobx";
import { ITab } from "../types/ITab";
import { Maybe } from "../types/Maybe";

export class Tab implements ITab {
    constructor(
        public id: number,
        public title: string,
        public url: string,
        public groupName?: string,
        public groupColor?: string,
        public favIconUrl?: string
    ) {
        makeAutoObservable(this);
    }

    /**
     * Is this tab in a group?
     */
    isInGroup() {
        // If the group name is a defined string, return true
        return this.groupName !== undefined;
    }
}

export class WindowObserver {
    windows: Window[] = [];

    constructor() {
        makeAutoObservable(this);
        this.loadChromeWindows();
    }

    /**
     * Load all Chrome windows and place them in the `windows` array.
     */
    async loadChromeWindows() {
        const chromeWindows = await chrome.windows.getAll({ populate: true });
        // The new array of windows. This will be assigned to `windows` at the end.
        const newWindows: Window[] = [];
        // Iterate over each window, along with an index
        let i = 0;
        for (let window of chromeWindows) {
            // get Session ID for window, from Chrome
            // const sessionId = window.sessionId;
            // console.log(`> sessionId for window ${window.id}: ${sessionId}`);
            const tabs: Tab[] = [];
            if (!window.tabs || !window.id) {
                continue;
            }
            for (let tab of window.tabs) {
                if (
                    !tab ||
                    tab.id === undefined ||
                    tab.title === undefined ||
                    tab.groupId === undefined
                ) {
                    return;
                }
                // Use the Chrome tabGroups API to get the group name and color.
                let group: Maybe<chrome.tabGroups.TabGroup> = null;
                if (tab.groupId !== -1) {
                    group = await chrome.tabGroups.get(tab.groupId);
                }
                // const group: chrome.tabGroups.TabGroup =
                //     await chrome.tabGroups.get(tab.groupId);
                tabs.push(
                    new Tab(
                        tab.id,
                        tab.title,
                        tab.url || "",
                        group?.title || undefined,
                        group?.color || undefined,
                        tab.favIconUrl || ""
                    )
                );
            }
            /*
            window.tabs.forEach((tab) => {
                if (
                    !tab ||
                    tab.id === undefined ||
                    tab.title === undefined ||
                    tab.groupId === undefined
                ) {
                    return;
                }
                // Use the Chrome tabGroups API to get the group name and color
                // const group = await chrome.tabGroups.get(tab.groupId);
                
                tabs.push(
                    new Tab(
                        tab.id,
                        tab.title,
                        tab.groupId,
                        tab.url || "",
                        tab.favIconUrl || ""
                    )
                );
            });
            */
            // result.push({ id: window.id, tabs: tabs });
            // this.windows.push(new Window(window.id, i, tabs));
            newWindows.push(new Window(window.id, i, tabs));
            i++;
        }
        this.windows = newWindows;
    }
}

export class Window {
    id!: number;
    index!: number;
    tabs: Tab[] = [];

    constructor(id: number, index: number, tabs: Tab[]) {
        makeAutoObservable(this);
        this.id = id;
        this.index = index;
        this.tabs = tabs;
    }
}
