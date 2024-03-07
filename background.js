chrome.tabs.onUpdated.addListener(function onUpdatedListener(changeInfo) {
  if (changeInfo.status === "complete") {
    console.log("new tab, should inject");
    checkAndInject();
  }
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
  if (namespace === "sync") {
    if ("blockMode" in changes || "blockedSites" in changes) {
      checkAndInject();
    }
  }
});

function checkAndInject() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tab = tabs[0];
    const currentSite = tab.url;
    const tabId = tab.id;

    if (tabId && currentSite && !currentSite.startsWith("chrome://")) {
      chrome.storage.sync.get(["blockMode", "blockedSites"], function (data) {
        let blockedSites = data.blockedSites || [];
        let isBlocked = data.blockMode !== undefined ? data.blockMode : true;
        const currentSiteDomain = extractDomain(currentSite);

        if (
          currentSiteDomain &&
          blockedSites.includes(currentSiteDomain) &&
          isBlocked
        ) {
          console.log("should inject");
          injectContentScript(tabId);
        } else if (
          currentSiteDomain &&
          ((!blockedSites.includes(currentSiteDomain) && isBlocked) ||
            (blockedSites.includes(currentSiteDomain) && !isBlocked))
        ) {
          console.log("should remove");
          removeContentScript(tabId);
        }
      });
    }
  });
}

function injectContentScript(tabId) {
  chrome.scripting.insertCSS({
    target: { tabId: tabId },
    files: ["content.css"],
  });
}

function removeContentScript(tabId) {
  chrome.scripting.removeCSS({
    target: { tabId: tabId },
    files: ["content.css"],
  });
}

function extractDomain(url) {
  const hostname = new URL(url).hostname;
  return hostname.replace(/^www\./, "").replace(/\.com$/, "");
}
