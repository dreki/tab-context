import devTabs from '../data/dev-tabs.json';
import { makeAutoObservable } from 'mobx'

export class Tab {
    id!: number;
    title: string;
    groupId: number;
    url: string;
    favIconUrl: string;

    constructor(id: number, title: string, groupId: number, url: string, favIconUrl: string) {
        makeAutoObservable(this);
        this.id = id;
        this.title = title;
        this.groupId = groupId;
        this.url = url;
        this.favIconUrl = favIconUrl;
    }

    /**
     * Is this tab in a group?
     */
    isInGroup() {
        return this.groupId !== -1;
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
            if (!window.tabs || !window.id) { continue; }
            window.tabs.forEach((tab) => {
                if (!tab || tab.id === undefined || tab.title === undefined || tab.groupId === undefined) {
                    return;
                }
                tabs.push(new Tab(
                    tab.id,
                    tab.title,
                    tab.groupId,
                    tab.url || '',
                    tab.favIconUrl || ''
                ));
            });
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

    static async loadAll(): Promise<Window[] | null> {
        // If chrome API is not available, return static data from `src/data/dev-tabs.json`
        if (!chrome || !chrome.windows) {
            return Window.loadDevWindows();
        }
        // const result: Window[] = [];
        return await Window.loadWindowsFromChrome();
    }

    private static loadDevWindows(): Window[] {
        const result: Window[] = [];
        let i = 0;
        devTabs.forEach((window) => {
            const tabs: Tab[] = [];
            // For each object in devTabs, add to the result array
            window.tabs.forEach((tab) => {
                // `tab` is a Chrome tab
                tabs.push(new Tab(
                    tab.id,
                    tab.title,
                    tab.groupId,
                    tab.url,
                    tab.favIconUrl || ''
                ));
            });
            // result.push({ id: window.id, tabs: tabs });
            result.push(new Window(window.id, i, tabs));
            i++;
        });
        return result;
    }

    private static async loadWindowsFromChrome(): Promise<Window[] | null> {
        const result: Window[] = [];
        const chromeWindows = await chrome.windows.getAll({ populate: true });
        // chrome.windows.getAll({ populate: true }, (windows) => {
        console.log('> windows from Chrome:')
        console.log(chromeWindows);
        // Iterate over each window, along with an index
        let i = 0;
        for (let window of chromeWindows) {
            // get Session ID for window, from Chrome
            // const sessionId = window.sessionId;
            // console.log(`> sessionId for window ${window.id}: ${sessionId}`);
            const tabs: Tab[] = [];
            if (!window.tabs || !window.id) { continue; }
            window.tabs.forEach((tab) => {
                if (!tab || tab.id === undefined || tab.title === undefined || tab.groupId === undefined) {
                    return;
                }
                tabs.push(new Tab(
                    tab.id,
                    tab.title,
                    tab.groupId,
                    tab.url || '',
                    tab.favIconUrl || ''
                ));
            });
            // result.push({ id: window.id, tabs: tabs });
            result.push(new Window(window.id, i, tabs));
            i++;
        }
        // resolve(result);
        return result;
        // });
    }
}
