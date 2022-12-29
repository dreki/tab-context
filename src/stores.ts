import { atom } from 'jotai';

import devTabs from './data/dev-tabs.json';

export interface ITab {
    id: number;
    title: string;
    groupId: number;

    // A function called `isInGroup` that returns true if the tab is in a group
    isInGroup: () => boolean;
}

// Implement the Tab interface
class Tab implements ITab {
    constructor(public id: number, public title: string, public groupId: number) {
    }

    isInGroup() {
        return this.groupId !== -1;
    }
}

// Implement the `isInGroup` function
// Tab.prototype.isInGroup = function () {
//     return this.groupId !== -1;
// }

export interface IWindow {
    id: number;
    tabs: ITab[];
}

/*
import { createStore } from 'zustand';

interface WindowState {
    windows: chrome.windows.Window[];
    loadWindows: () => void;
}

export const useWindowStore = createStore<WindowState>()((set) => ({
    windows: [],
    // loadWindows: () => set((state) => {
    //     // set((state) => ({
    //     //     windows: [
    //     //         { id: 1, name: 'Window 1' },
    //     //         { id: 2, name: 'Window 2' },
    //     //         { id: 3, name: 'Window 3' },
    //     //     ],
    //     // }));

    // })
    loadWindows: () => {
        // Load all windows and tabs from the Chrome API
        chrome.windows.getAll({ populate: true }, (windows) => {
            // set((state) => ({
            //     windows: windows,
            // }));
            console.log('> windows:')
            console.log(windows);
            
        });
    }
}));

// export { useWindowStore };
*/

const fetchWindowsAtom = atom(async () => {
    
    /* 
    return new Promise<chrome.windows.Window[]>((resolve, reject) => {
        // If chrome API is not available, reject the promise
        if (!chrome || !chrome.windows) {
            reject(new Error('Chrome API is not available'));
            return;
        }

        chrome.windows.getAll({ populate: true }, (windows) => {
            resolve(windows);
        });
    });
     */

    return new Promise<IWindow[]>((resolve, reject) => {
        const result: IWindow[] = [];
        // If chrome API is not available, return static data from `src/data/dev-tabs.json`
        if (!chrome || !chrome.windows) {
            // reject(new Error('Chrome API is not available'));
            // return;
            // return fetch('./data/dev-tabs.json')
            
            // resolve(devTabs as IWindow[]);

            // For each object in devTabs, add to the result array
            devTabs.forEach((window) => {
                const tabs: ITab[] = [];
                window.tabs.forEach((tab) => {
                    tabs.push(new Tab(tab.id, tab.title, tab.groupId));
                });
                result.push({ id: window.id, tabs: tabs });
            });
            resolve(result);
        }

        chrome.windows.getAll({ populate: true }, (windows) => {
            // resolve(windows);
            windows.forEach((window) => {
                const tabs: ITab[] = [];
                if (!window.tabs || !window.id) {
                    return;
                }
                window.tabs.forEach((tab) => {
                    if (!tab || tab.id === undefined || tab.title === undefined || tab.groupId === undefined) {
                        return;
                    }
                    tabs.push(new Tab(tab.id, tab.title, tab.groupId));
                });
                result.push({ id: window.id, tabs: tabs });
            });
        });
        resolve(result);
    });
});
// const windowsAtom = atom<chrome.windows.Window[]>([]);
const windowsAtom = atom(async (get) => {
    return get(fetchWindowsAtom);
});

export { windowsAtom };
