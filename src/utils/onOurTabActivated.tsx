interface IOnOurTabActivatedParams {
    // An async function to call when our tab is activated.
    callback: () => Promise<void>;
}

/**
 * Listen for our tab to become activated.
 * @param {IOnOurTabActivatedParams} params
 * @param {() => Promise<void>} params.callback An async function to call when our tab is activated.
 */
export function onOurTabActivated({
    callback: onOurTabActivated,
}: IOnOurTabActivatedParams) {
    // Listen for our tab to become activated
    chrome.tabs.onActivated.addListener(
        (activeInfo: chrome.tabs.TabActiveInfo): void => {
            chrome.tabs.getCurrent((tab) => {
                if (!tab) {
                    return;
                }
                if (tab.id === activeInfo.tabId) {
                    onOurTabActivated();
                }
            });
        }
    );

    chrome.tabs.onCreated.addListener((tab) => {
        chrome.tabs.getCurrent((currentTab) => {
            if (!currentTab) {
                return;
            }
            if (currentTab.id === tab.id) {
                onOurTabActivated();
            }
        });
    });

    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        chrome.tabs.getCurrent((currentTab) => {
            if (!currentTab) {
                return;
            }
            if (currentTab.id === tabId) {
                onOurTabActivated();
            }
        });
    });
}
