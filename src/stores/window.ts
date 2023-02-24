import { makeAutoObservable } from "mobx";
import { ITab } from "../types/ITab";
import { Maybe } from "../types/Maybe";
import { TabCollection } from "./closedTabs";

export class Tab implements ITab {
    constructor(
        public id: number,
        public title: string,
        public pinned: boolean,
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
                tabs.push(
                    new Tab(
                        tab.id,
                        tab.title,
                        tab.pinned,
                        tab.url || "",
                        group?.title || undefined,
                        group?.color || undefined,
                        tab.favIconUrl || ""
                    )
                );
            }
            newWindows.push(new Window(window.id, i, tabs));
            i++;
        }
        this.windows = newWindows;
    }
}

export class Window {
    id!: number;
    index!: number;
    tabs: ITab[] = [];
    // closedTabs: ITab[] = [];
    // closedTabs!: TabCollection;

    constructor(id: number, index: number, tabs: ITab[]) {
        makeAutoObservable(this);
        this.id = id;
        this.index = index;
        this.tabs = tabs;
        // this.loadClosedTabs();
    }

    // public async loadClosedTabs() {
    //     this.closedTabs = await TabCollection.loadClosedTabs(this.index);
    // }

    /**
     * Convenience method to get the current window ID.
     * @returns The ID of the current window, or null if it cannot be found.
     */
    public static async getCurrentWindowId(): Promise<Maybe<number>> {
        const window = await chrome.windows.getCurrent();
        if (!window) {
            return null;
        }
        if (!window.id) {
            return null;
        }
        return window.id;
    }
}
