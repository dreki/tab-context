import { Window, Tab } from "../stores/window";
import { Session } from "../stores/session";
import { v4 as uuidv4 } from "uuid";

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
      chrome.tabs.query({ active: true, currentWindow: true }, (queryTabs) => {
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
      });
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

export async function onSaveWindowToSession(window: Window) {
  const session = new Session();
  // Send message to all content scripts in all tabs in the window.
  // const message = {
  //   type: "saveWindowToSession",
  //   payload: {
  //     sessionId: session.id,
  //   },
  // };
  const message: ISaveWindowToSessionMessage = {
    type: "saveWindowToSession",
    payload: {
      generatedId: sessionIdFactory(),
    },
  };

  const tabs: Tab[] = window.tabs;
  // Reload the first three tabs and send message to them.
  const tabsToReload = tabs.slice(0, 3);

  console.log(`> Reloading tabs`);
  await reloadTabs(tabsToReload, false);
  console.log(`> Tabs reloaded; sending message to tabs`);
  for (let tab of tabsToReload) {
    // Connect to the content script.
    // chrome.tabs.connect(tab.id);
    try {
      console.log(`> sending message to tab ${tab.id}`);
      // const result = await chrome.tabs.sendMessage(tab.id, message);
      let sessionId: any;
      // chrome.tabs.sendMessage(tab.id, message).then((response) => {
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
    } catch (error) {}
  }
  /* 
  // Hold reference to function here so that it can be used in the callback safely.
  const reloadFn = chrome.tabs.reload;

  // Reload the first three tabs and send message to them.
  const tabsToReload = tabs.slice(0, 3);
  for (let tab of tabsToReload) {
    chrome.tabs.query({ active: true, currentWindow: true }, (queryTabs) => {
      for (let queryTab of queryTabs) {
        // Don't reload the current tab.
        if (queryTab.id === tab.id) {
          continue;
        }
        // Reload the tab.
        reloadFn(tab.id);
      }
    });
  }
  // Wait until tabs are loaded.
  let tabsLoaded = 0;
  chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo, tab) {
    if (changeInfo.status === "complete") {
      tabsLoaded++;
    }

    if (tabsLoaded === tabsToReload.length) {
      chrome.tabs.onUpdated.removeListener(listener);
      console.log(`> all tabs are loaded`);
      for (let tab of tabsToReload) {
        // Connect to the content script.
        // chrome.tabs.connect(tab.id);
        try {
          console.log(`> sending message to tab ${tab.id}`);
          // const result = await chrome.tabs.sendMessage(tab.id, message);
          let sessionId: any;
          // chrome.tabs.sendMessage(tab.id, message).then((response) => {
          chrome.tabs
            .sendMessage<
              ISaveWindowToSessionMessage,
              ISaveWindowToSessionResponse
            >(tab.id, message)
            .then((response) => {
              console.log(`> response:`);
              console.log(response);
              // sessionId = sessionId;
            });
        } catch (error) {}
      }
    }
  });
   */

  // for (let tab of tabsToReload) {
  //   // Connect to the content script.
  //   // chrome.tabs.connect(tab.id);
  //   try {
  //     const result = await chrome.tabs.sendMessage(tab.id, message);
  //   } catch (error) {}
  // }
}
