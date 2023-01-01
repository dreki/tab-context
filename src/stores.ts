import { atom } from 'jotai';

import devTabs from './data/dev-tabs.json';

export interface ITab {
    id: number;
    title: string;
    groupId: number;
    url?: string;
    favIconUrl?: string;

    // A function called `isInGroup` that returns true if the tab is in a group
    isInGroup: () => boolean;
}

// Implement the Tab interface
class Tab implements ITab {
    constructor(
        public id: number,
        public title: string,
        public groupId: number,
        public url?: string,
        public favIconUrl?: string
    ) {
    }

    isInGroup() {
        return this.groupId !== -1;
    }
}

export interface IWindow {
    id: number;
    tabs: ITab[];
}


const fetchWindowsAtom = atom(async () => {

    return new Promise<IWindow[]>((resolve, reject) => {
        const result: IWindow[] = [];
        // If chrome API is not available, return static data from `src/data/dev-tabs.json`
        if (!chrome || !chrome.windows) {
            // For each object in devTabs, add to the result array
            devTabs.forEach((window) => {
                const tabs: ITab[] = [];
                window.tabs.forEach((tab) => {
                    // `tab` is a Chrome tab
                    tabs.push(new Tab(
                        tab.id,
                        tab.title,
                        tab.groupId,
                        tab.url,
                        tab.favIconUrl
                    ));
                });
                result.push({ id: window.id, tabs: tabs });
            });
            resolve(result);
        }

        chrome.windows.getAll({ populate: true }, (windows) => {
            // console.log('> windows (from Chrome):')
            // console.log(windows);
            console.log(`> windows length (from Chrome): ${windows.length}`)
            // windows.forEach((window) => {
            for (let window of windows) {
                const tabs: ITab[] = [];
                if (!window.tabs || !window.id) { return; }
                window.tabs.forEach((tab) => {
                    if (!tab || tab.id === undefined || tab.title === undefined || tab.groupId === undefined) {
                        return;
                    }
                    tabs.push(new Tab(
                        tab.id,
                        tab.title,
                        tab.groupId,
                        tab.url,
                        tab.favIconUrl
                    ));
                });
                result.push({ id: window.id, tabs: tabs });
                // });
            }
            console.log(`> result length(from Chrome): ${result.length}`)
            resolve(result);
        });
        // resolve(result);
    });
});

const windowsAtom = atom(async (get) => {
    return get(fetchWindowsAtom);
});

export { windowsAtom };
