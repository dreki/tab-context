import { Session, Tab as SessionTab } from "../stores/session";
import { Tab, Window } from "../stores/window";

function sessionIdFactory(): string {
    // Use base 36 to be more compact.
    return Math.random().toString(36).substring(2, 9);
}

export interface ISaveWindowToSessionMessage {
    type: "saveWindowToSession";
    payload: {
        // To use if a session ID doesn't exist already in the content script.
        generatedId: string;
    };
}

export interface ISaveWindowToSessionResponse {
    type: "saveWindowToSessionResponse";
    payload: {
        sessionId: string;
    };
}

/**
 * Convert a window tab to a session tab.
 * @param tab The window tab to use to create a session tab.
 * @returns A session tab.
 */
function tabToSessionTab(tab: Tab): SessionTab {
    /*
        title: string;
    groupId: number;
    url: string;
    favIconUrl: string;
    */
    return {
        title: tab.title,
        groupId: tab.groupId,
        url: tab.url,
        favIconUrl: tab.favIconUrl,
    } as SessionTab;
}

/**
 * Reload Chrome tabs represented by `tabs`. Returns when all tabs are reloaded.
 * @param tabs Array of tabs to reload.
 */
async function reloadTabs(
    tabs: Tab[],
    reloadCurrentTab: boolean = false
): Promise<void> {
    /* 
  const result: Promise<void> = new Promise((resolve, reject) => {
    let tabsLoaded: number = 0;
    chrome.tabs.onUpdated.addListener(function listener(
      tabId,
      changeInfo,
      tab
    ) {
      console.log("> onUpdated");
      if (changeInfo.status === "complete") {
        tabsLoaded++;
        if (tabsLoaded === tabs.length) {
          chrome.tabs.onUpdated.removeListener(listener);
          resolve();
        }
      }
    });
  });
   */

    return new Promise((resolve, reject) => {
        // Hold reference to function here so that it can be used in the callback safely.
        const reloadFn = chrome.tabs.reload;
        let reloadPromises: Promise<void>[] = [];
        for (let tab of tabs) {
            // chrome.tabs.reload(tab.id);
            chrome.tabs.query(
                { active: true, currentWindow: true },
                (queryTabs) => {
                    for (let queryTab of queryTabs) {
                        // Don't reload the current tab.
                        if (queryTab.id === tab.id && !reloadCurrentTab) {
                            continue;
                        }
                        // Reload the tab.
                        reloadPromises.push(reloadFn(tab.id));
                    }
                    // Wait for all tabs to reload.
                    Promise.all(reloadPromises).then(() => {
                        resolve();
                    });
                }
            );
        }
    });

    // let tabsLoaded: number = 0;
    // return new Promise((resolve, reject) => {
    //   chrome.tabs.onUpdated.addListener(function listener(
    //     tabId,
    //     changeInfo,
    //     tab
    //   ) {
    //     if (changeInfo.status === "complete") {
    //       tabsLoaded++;
    //       if (tabsLoaded === tabs.length) {
    //         chrome.tabs.onUpdated.removeListener(listener);
    //         resolve();
    //       }
    //     }
    //   });
    // });

    // return result;
}

/**
 * Syncs all tabs in the window to the session, and then closes the window.
 * @param window The window to suspend.
 */
export async function suspend(window: Window) {
    // Reload all tabs in the window.
    // await reloadTabs(window.tabs, true);
}

export async function onSaveWindowToSession__DEP(window: Window) {
    const tabs: Tab[] = window.tabs;
    const session = new Session(tabs.map((tab) => tabToSessionTab(tab)));

    /*
    // Deprecated usage, but might be useful to see how it worked.
    const message: ISaveWindowToSessionMessage = {
        type: "saveWindowToSession",
        payload: {
            generatedId: sessionIdFactory(),
        },
    };
    chrome.tabs
        .sendMessage<ISaveWindowToSessionMessage, ISaveWindowToSessionResponse>(
          tab.id,
          message
        )
        .then((response) => {
          console.log(`> response:`);
          console.log(response);
          // sessionId = sessionId;
        });
  */
}
