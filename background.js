console.log("background.js");

// Listens for changes to the storage and triggers a callback when data is updated
chrome.storage.onChanged.addListener(function (changes, namespace) {
  if (namespace === "sync" && "blockedSites" in changes) {
    // The 'blockedSites' key in sync storage has changed
    console.log(
      "Blocked sites have been updated:",
      changes.blockedSites.newValue
    );

    // Check and inject content.js script
    checkAndInjectContentScript();
  }
});

// Function to get the ID of the current tab
function getTabId() {
  console.log("getTabID");
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      resolve(tab ? tab.id : null);
    });
  });
}

// Function to get the current site's URL
function getCurrentSite() {
  console.log("get currentSite");
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      resolve(tab ? tab.url : null);
    });
  });
}

// Function to check if the current site is blocked and inject content.js script
function checkAndInjectContentScript() {
  console.log("checkAndInjectContentScript");
  // TODO: console.log above generates, but code below does not
  // getCurrentSite and getTabId currently returning null
  Promise.all([getTabId(), getCurrentSite()]).then(([tabId, currentSite]) => {
    console.log("tabId", tabId);
    console.log("currentSite", currentSite);
    if (tabId && currentSite) {
      chrome.storage.sync.get(["blockMode", "blockedSites"], function (data) {
        let blockedSites = data.blockedSites || [];
        let isBlocked = data.blockMode !== undefined ? data.blockMode : true;
        const currentSiteDomain = extractDomain(currentSite);
        console.log(
          "checkAndInjectContentScript currentSiteDomain",
          currentSiteDomain
        );

        // Check if the current site is in the list of blocked sites
        if (blockedSites.includes(currentSiteDomain) && isBlocked) {
          // If the current site is in the list of blocked sites, inject content.js script
          chrome.scripting
            .executeScript({
              target: { tabId: tabId },
              files: ["content.js"],
            })
            .then(() => console.log("content.js script injected"));
        }
      });
    }
  });
}

function extractDomain(url) {
  const hostname = new URL(url).hostname;
  return hostname.replace(/^www\./, "").replace(/\.com$/, "");
}

// Check and inject content.js script on initial setup
checkAndInjectContentScript();

// // TODO: Fix alarm. Current alarm doesn't appear to be showing
// chrome.alarms.onAlarm.addListener(() => {
//   chrome.action.setBadgeText({ text: "" });
//   chrome.notifications.create({
//     type: "basic",
//     iconUrl: "images/icon16.png",
//     title: "Focus time complete",
//     message: "Time for a break!",
//     buttons: [{ title: "Keep it going" }],
//     priority: 0,
//   });
// });

// chrome.notifications.onButtonClicked.addListener(async () => {
//   const item = await chrome.storage.sync.get(["minutes"]);
//   chrome.action.setBadgeText({ text: "ON" });
//   chrome.alarms.create({ delayInMinutes: item.minutes });
// });

// // chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
// //   if (request.action === "blockCurrentSite") {
// //     // Get the current active tab
// //     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
// //       const activeTab = tabs[0];
// //       const currentSite = extractDomain(activeTab.url);

// //       // Perform blocking logic here...
// //       // For example, you can simulate blocking by redirecting to a different page
// //       const blockedPageURL = chrome.extension.getURL("blocked.html");

// //       // Redirect the active tab to the blocked page
// //       chrome.tabs.update(activeTab.id, { url: blockedPageURL });

// //       // Update storage with the new blocked site
// //       chrome.storage.sync.get("blockedSites", function (data) {
// //         const blockedSites = data.blockedSites || [];

// //         if (!blockedSites.includes(currentSite)) {
// //           blockedSites.push(currentSite);
// //           chrome.storage.sync.set({ blockedSites, currentSite }, function () {
// //             console.log(`${currentSite} has been blocked.`);

// //             // Notify background script to update the blocked sites logic
// //             chrome.runtime.sendMessage({ action: "updateBlockedSites" });
// //           });
// //         } else {
// //           console.log(`${currentSite} is already blocked.`);
// //         }
// //       });
// //     });
// //   }
// // });

// // function extractDomain(url) {
// //   // Extract domain logic (replace this with your actual implementation)
// //   const hostname = new URL(url).hostname;
// //   return hostname.replace(/^www\./, "").replace(/\.com$/, "");
// // }

// // --------------------

// // chrome.runtime.onInstalled.addListener(() => {
// //   chrome.action.setBadgeText({
// //     text: "OFF",
// //   });
// // });

// // const extensions = "https://developer.chrome.com/docs/extensions";
// // const webstore = "https://developer.chrome.com/docs/webstore";

// // // When the user clicks on the extension action
// // chrome.action.onClicked.addListener(async (tab) => {
// //   if (tab.url.startsWith(extensions) || tab.url.startsWith(webstore)) {
// //     // We retrieve the action badge to check if the extension is 'ON' or 'OFF'
// //     const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
// //     // Next state will always be the opposite
// //     const nextState = prevState === "ON" ? "OFF" : "ON";

// //     // Set the action badge to the next state
// //     await chrome.action.setBadgeText({
// //       tabId: tab.id,
// //       text: nextState,
// //     });

// //     if (nextState === "ON") {
// //       // Insert the CSS file when the user turns the extension on
// //       await chrome.scripting.insertCSS({
// //         files: ["focus-mode.css"],
// //         target: { tabId: tab.id },
// //       });
// //     } else if (nextState === "OFF") {
// //       // Remove the CSS file when the user turns the extension off
// //       await chrome.scripting.removeCSS({
// //         files: ["focus-mode.css"],
// //         target: { tabId: tab.id },
// //       });
// //     }
// //   }
// // });

// // -------------
// chrome.runtime.onInstalled.addListener(function () {
//   executeBlockingLogic();
// });

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   if (request.action === "executeScript") {
//     executeBlockingLogic();
//   }
// });

// chrome.tabs.onActivated.addListener(function (activeInfo) {
//   chrome.tabs.get(activeInfo.tabId, function (tab) {
//     if (tab.url) {
//       executeBlockingLogic(tab);
//     }
//   });
// });

// // Listen for changes in the active tab and refresh blocking logic
// chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
//   if (tab.active && changeInfo.url) {
//     executeBlockingLogic(tab);
//   }
// });

// function executeBlockingLogic() {
//   // Hardcoding activeTab information for testing (replace with actual testing URL)
//   const hardcodedActiveTab = {
//     id: 1496793479, // Replace with the actual tab ID
//     url: "https://www.youtube.com/", // Replace with the testing URL
//   };

//   const activeTab = hardcodedActiveTab;

//   if (activeTab && activeTab.url !== undefined) {
//     const currentSite = extractDomain(activeTab.url);
//     console.log("activeTab", activeTab);
//     console.log("currentSite", currentSite);

//     chrome.storage.sync.get(["isBlocked", "blockedSites"], function (data) {
//       const isBlocked = data.isBlocked !== undefined ? data.isBlocked : true;
//       const blockedSites = data.blockedSites || [];

//       console.log(
//         "isCurrentSiteBlocked",
//         isCurrentSiteBlocked(currentSite, blockedSites)
//       );

//       if (isBlocked && isCurrentSiteBlocked(currentSite, blockedSites)) {
//         chrome.tabs.sendMessage(activeTab.id, {
//           action: "blockSite",
//           site: currentSite,
//         });
//       }
//     });
//   } else {
//     console.error("Invalid activeTab:", JSON.stringify(activeTab));
//   }
// }

// function extractDomain(url) {
//   return url
//     ? new URL(url).hostname.replace(/^www\./, "").replace(/\.com$/, "")
//     : null;
// }

// function isCurrentSiteBlocked(currentSite, blockedSites) {
//   return blockedSites.includes(currentSite);
// }
