// content.js

console.log("Content.js is running");

chrome.storage.sync.get(["isBlocked", "blockedSites"], function (data) {
  const isBlocked = data.isBlocked !== undefined ? data.isBlocked : true;
  const blockedSites = data.blockedSites || [];

  if (isBlocked && isCurrentSiteBlocked(blockedSites)) {
    const blockedMessage = document.createElement("div");
    blockedMessage.innerHTML = "<p>This site is blocked during focus time.</p>";
    blockedMessage.style.position = "fixed";
    blockedMessage.style.top = "50%";
    blockedMessage.style.left = "50%";
    blockedMessage.style.transform = "translate(-50%, -50%)";
    blockedMessage.style.backgroundColor = "#fff";
    blockedMessage.style.padding = "20px";
    blockedMessage.style.border = "2px solid #000";
    blockedMessage.style.zIndex = "9999";
    document.body.appendChild(blockedMessage);
  }
});

function isCurrentSiteBlocked(blockedSites) {
  const currentSite = window.location.hostname
    .replace(/^www\./, "")
    .replace(/\.com$/, "");
  return blockedSites.includes(currentSite);
}
