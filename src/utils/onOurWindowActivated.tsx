
interface IOnOurWindowActivatedParams {
    // An async function to call when our window is activated.
    onOurWindowActivated: () => Promise<void>;
}

export function onOurWindowActivated({
    onOurWindowActivated,
}: IOnOurWindowActivatedParams) {
    // Listen to on _window_ activation as well
    chrome.windows.onFocusChanged.addListener((windowId) => {
        // If the focused window is our window, reload the windows data.
        // Otherwise, do nothing.
        chrome.windows.getCurrent((window) => {
            if (!window) {
                return;
            }
            if (window.id === windowId) {
                onOurWindowActivated();
            }
        });
    });
}
