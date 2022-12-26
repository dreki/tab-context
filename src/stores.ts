import { atom } from 'jotai';

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
});
// const windowsAtom = atom<chrome.windows.Window[]>([]);
const windowsAtom = atom(async (get) => {
    return get(fetchWindowsAtom);
});

export { windowsAtom };
