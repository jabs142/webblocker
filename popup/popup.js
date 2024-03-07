document.addEventListener("DOMContentLoaded", function () {
  const siteInfo = document.getElementById("siteInfo");
  const focusBtn = document.getElementById("focusBtn");
  const blockBtn = document.getElementById("blockBtn");
  const toggleDarkModeBtn = document.getElementById("toggleDarkModeBtn");
  const themeIcon = document.getElementById("themeIcon");
  const blockListIcon = document.getElementById("blockListBtn");

  blockListIcon.addEventListener("click", function () {
    window.location.href = "../blockedSites/blockedSites.html";
  });

  chrome.storage.sync.get(
    ["blockMode", "currentSite", "darkMode"],
    function (data) {
      let isBlocked = data.blockMode !== undefined ? data.blockMode : false;
      let isDarkMode = data.darkMode !== undefined ? data.darkMode : false;

      updateFocusBtnText(isBlocked);
      updateSiteInfo();
      updateDarkMode(isDarkMode);

      // Toggle the blocked mode on click
      focusBtn.addEventListener("click", function () {
        isBlocked = !isBlocked;
        console.log("isBlocked?", isBlocked);
        chrome.storage.sync.set({ blockMode: isBlocked });
        updateFocusBtnText(isBlocked);
      });

      // Toggle dark mode on click
      toggleDarkModeBtn.addEventListener("click", function () {
        isDarkMode = !isDarkMode;
        chrome.storage.sync.set({ darkMode: isDarkMode });
        updateDarkMode(isDarkMode);
      });

      // Add current site to blocked list and store in chrome storage
      blockBtn.addEventListener("click", function () {
        chrome.tabs.query(
          { active: true, currentWindow: true },
          function (tabs) {
            const activeTabURL = tabs[0].url;
            const currentSite = extractDomain(activeTabURL);
            console.log("Pop up currentSite ", currentSite);

            // Update the storage with the new blocked site
            chrome.storage.sync.get("blockedSites", function (data) {
              const blockedSites = data.blockedSites || [];

              if (!blockedSites.includes(currentSite)) {
                blockedSites.push(currentSite);
                chrome.storage.sync.set({ blockedSites }, function () {
                  console.log(`${currentSite} has been blocked.`);
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

  function updateFocusBtnText(isBlocked) {
    focusBtn.textContent = isBlocked ? "Focus Mode" : "Surf Mode";
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
