console.log("Popup.js is running");

document.addEventListener("DOMContentLoaded", function () {
  const toggleBtn = document.getElementById("toggleBtn");
  const siteInfo = document.getElementById("siteInfo");
  const blockButton = document.getElementById("blockButton");
  const toggleDarkModeBtn = document.getElementById("toggleModeBtn");
  const themeIcon = document.getElementById("themeIcon");
  const blockListButton = document.getElementById("blockListBtn");

  // Add a click event listener to the button
  blockListButton.addEventListener("click", function () {
    // Redirect to the desired HTML page
    window.location.href = "../blockedSites/blockedSites.html";
  });

  // Retrieve the current mode from storage only once when the DOM is loaded
  chrome.storage.sync.get(
    ["blockMode", "currentSite", "darkMode"],
    function (data) {
      let isBlocked = data.blockMode !== undefined ? data.blockMode : false;
      let isDarkMode = data.darkMode !== undefined ? data.darkMode : false;

      updateButtonText(isBlocked);
      updateSiteInfo();
      updateDarkMode(isDarkMode);

      // Toggle the blocked mode on click
      toggleBtn.addEventListener("click", function () {
        isBlocked = !isBlocked;
        console.log("isBlocked?", isBlocked);

        // Update the storage with the new mode
        chrome.storage.sync.set({ blockMode: isBlocked });

        // Update the button text
        updateButtonText(isBlocked);
        updateDarkMode(isDarkMode);

        // // Notify background script to update the blocked sites logic
        // chrome.runtime.sendMessage({ blockMode: isBlocked });

        // Notify content script to update the blocked sites logic
        chrome.tabs.query(
          { active: true, currentWindow: true },
          function (tabs) {
            const activeTab = tabs[0];

            // Check if content script is injected before sending the message
            chrome.tabs.sendMessage(
              activeTab.id,
              { blockMode: isBlocked },
              function (response) {
                if (chrome.runtime.lastError) {
                  console.log(chrome.runtime.lastError);
                }
              }
            );
          }
        );
      });

      // Toggle dark mode on click
      toggleDarkModeBtn.addEventListener("click", function () {
        isDarkMode = !isDarkMode;
        chrome.storage.sync.set({ darkMode: isDarkMode });
        updateDarkMode(isDarkMode);
      });

      // TODO: Fix this. Currently not working
      // Add event listener to the Block button
      blockButton.addEventListener("click", function () {
        chrome.tabs.query(
          { active: true, currentWindow: true },
          function (tabs) {
            const activeTabURL = tabs[0].url;
            const currentSite = extractDomain(activeTabURL);

            // Update the storage with the new blocked site
            chrome.storage.sync.get("blockedSites", function (data) {
              const blockedSites = data.blockedSites || [];

              if (!blockedSites.includes(currentSite)) {
                blockedSites.push(currentSite);
                chrome.storage.sync.set({ blockedSites }, function () {
                  console.log(`${currentSite} has been blocked.`);

                  // Update site info after blocking
                  updateSiteInfo(currentSite);
                });
              } else {
                console.log(`${currentSite} is already blocked.`);
              }
            });
          }
        );
      });
    }
  );

  function updateButtonText(isBlocked) {
    toggleBtn.textContent = isBlocked ? "Focus Mode" : "Surf Mode";
  }

  function extractDomain(url) {
    const hostname = new URL(url).hostname;
    return hostname.replace(/^www\./, "").replace(/\.com$/, "");
  }

  function updateSiteInfo() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0];
      const currentSite = extractDomain(activeTab.url);
      siteInfo.textContent = `You are currently on ${currentSite}`;
    });
  }

  function updateDarkMode(isDarkMode) {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
      themeIcon.src = "../images/night-mode.png";
    } else {
      document.body.classList.remove("dark-mode");
      themeIcon.src = "../images/bright-mode.png";
    }
  }
});
