document.addEventListener("DOMContentLoaded", function () {
  const toggleBtn = document.getElementById("toggleBtn");
  const siteInfo = document.getElementById("siteInfo");
  const blockButton = document.getElementById("blockButton");
  const toggleModeBtn = document.getElementById("toggleModeBtn");
  const modeIcon = document.getElementById("modeIcon");

  // Retrieve the current mode from storage only once when the DOM is loaded
  chrome.storage.sync.get(
    ["blockMode", "currentSite", "darkMode"],
    function (data) {
      let isBlocked = data.blockMode !== undefined ? data.blockMode : true;
      let isDarkMode = data.darkMode !== undefined ? data.darkMode : false;

      updateButtonText(isBlocked);
      updateSiteInfo();
      updateDarkMode(isDarkMode);

      // Toggle the blocked mode on click
      toggleBtn.addEventListener("click", function () {
        isBlocked = !isBlocked;

        // Update the storage with the new mode
        chrome.storage.sync.set({ blockMode: isBlocked });

        // Update the button text
        updateButtonText(isBlocked);
        updateDarkMode(isDarkMode);

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
      toggleModeBtn.addEventListener("click", function () {
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
            const activeTab = tabs[0];
            const currentSite = extractDomain(activeTab.url);

            // Update the storage with the new blocked site
            chrome.storage.sync.get("blockedSites", function (data) {
              const blockedSites = data.blockedSites || [];

              if (!blockedSites.includes(currentSite)) {
                blockedSites.push(currentSite);
                chrome.storage.sync.set(
                  { blockedSites, currentSite },
                  function () {
                    console.log(`${currentSite} has been blocked.`);
                    // Update site info after blocking
                    updateSiteInfo(currentSite);
                  }
                );
              } else {
                console.log(`${currentSite} is already blocked.`);
              }
              // Update site info after blocking
              updateSiteInfo(currentSite);
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
      modeIcon.src = "night-mode.png";
    } else {
      document.body.classList.remove("dark-mode");
      modeIcon.src = "bright-mode.png";
    }
  }
});
