
interface IOnOurTabActivatedParams {
    // An async function to call when our tab is activated.
    onOurTabActivated: () => Promise<void>;
}

export function onOurTabActivated({
    onOurTabActivated,
}: IOnOurTabActivatedParams) {
    // Listen for our tab to become activated
    chrome.tabs.onActivated.addListener((activeInfo) => {
        chrome.tabs.getCurrent((tab) => {
            if (!tab) {
                return;
            }
            if (tab.id === activeInfo.tabId) {
                onOurTabActivated();
            }
        });
    });
}
