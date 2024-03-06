document.addEventListener("DOMContentLoaded", function () {
  const siteInfo = document.getElementById("siteInfo");
  const focusBtn = document.getElementById("focusBtn");
  const blockBtn = document.getElementById("blockBtn");
  const toggleDarkModeBtn = document.getElementById("toggleDarkModeBtn");
  const themeIcon = document.getElementById("themeIcon");
  const blockListIcon = document.getElementById("blockListBtn");

  // Clicking the blockList button redirects to the blocked list page
  blockListIcon.addEventListener("click", function () {
    window.location.href = "../blockedSites/blockedSites.html";
  });

  // Retrieve the current mode, theme mode and list of blocked sites from Chrome storage
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

// function setAlarm(event) {
//   let minutes = parseFloat(event.target.value);
//   let secondsRemaining = minutes * 60;

//   chrome.alarms.create({ delayInMinutes: minutes });
//   chrome.storage.sync.set({ minutes: minutes });

//   // Update badge text with countdown timer
//   updateBadgeText(secondsRemaining);

//   // Start updating badge text every second
//   let intervalId = setInterval(function () {
//     secondsRemaining--;
//     updateBadgeText(secondsRemaining);

//     // Clear the interval when countdown reaches 0
//     if (secondsRemaining <= 0) {
//       clearInterval(intervalId);
//       chrome.action.setBadgeText({ text: "" });
//     }
//   }, 1000);

//   window.close();
// }

// function updateBadgeText(secondsRemaining) {
//   let minutes = Math.floor(secondsRemaining / 60);
//   let seconds = secondsRemaining % 60;

//   // Format minutes and seconds with leading zeros
//   let formattedMinutes = minutes.toString().padStart(2, "0");
//   let formattedSeconds = seconds.toString().padStart(2, "0");

//   let badgeText = `${formattedMinutes}.${formattedSeconds}`;

//   chrome.action.setBadgeText({ text: badgeText });
// }

// function clearAlarm() {
//   chrome.action.setBadgeText({ text: "Done!" });
//   chrome.alarms.clearAll();
//   window.close();
// }

// // An Alarm delay of less than the minimum 1 minute will fire
// // in approximately 1 minute increments if released
// document.getElementById("sampleMinute").addEventListener("click", setAlarm);
// document.getElementById("cancelAlarm").addEventListener("click", clearAlarm);
