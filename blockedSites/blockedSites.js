document.addEventListener("DOMContentLoaded", function () {
  const blockListIcon = document.getElementById("blockListBtn");
  const blockList = document.getElementById("blockList");
  const toggleDarkModeBtn = document.getElementById("toggleModeBtn");
  let isDarkMode;

  // Clicking the blockList button redirects back to the home page
  blockListIcon.addEventListener("click", function () {
    window.location.href = "../popup/popup.html";
  });

  // Fetch the list of blocked sites from Chrome storage
  chrome.storage.sync.get(["darkMode", "blockedSites"], function (data) {
    const blockedSites = data.blockedSites || [];
    isDarkMode = data.darkMode !== undefined ? data.darkMode : false;

    updatetheme(isDarkMode);

    // Toggle dark mode on click
    toggleDarkModeBtn.addEventListener("click", function () {
      isDarkMode = !isDarkMode;
      chrome.storage.sync.set({ darkMode: isDarkMode });
      updatetheme(isDarkMode);
    });

    // Dynamically create the list of blocked sites
    createBlockedSitesList(blockedSites, isDarkMode);
  });

  function updatetheme(isDarkMode) {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
      themeIcon.src = "../images/night-mode.png";
    } else {
      document.body.classList.remove("dark-mode");
      themeIcon.src = "../images/bright-mode.png";
    }
  }

  function createBlockedSitesList(blockedSites, isDarkMode) {
    if (blockedSites.length > 0) {
      const ul = document.createElement("ul");

      blockedSites.forEach(function (site) {
        const li = document.createElement("li");
        li.textContent = site;
        li.style.color = "gray";

        const deleteIcon = document.createElement("img");
        deleteIcon.src = "../images/cross.png";
        deleteIcon.alt = "Delete button";
        deleteIcon.title = "Remove site from the blocked list";
        deleteIcon.classList.add("delete-icon");

        deleteIcon.addEventListener("click", function () {
          const indexToRemove = blockedSites.indexOf(site);
          if (indexToRemove !== -1) {
            blockedSites.splice(indexToRemove, 1);
            chrome.storage.sync.set({ blockedSites });
            updateBlockedSitesList();
          }
        });

        li.appendChild(deleteIcon);
        ul.appendChild(li);
      });

      // Replace the content of the blockList element with the dynamic list
      blockList.innerHTML = "";
      blockList.appendChild(ul);
    } else {
      blockList.innerHTML =
        "<p style='color: grey'>No sites are currently blocked.</p>";
    }
  }

  // Function to update the UI with the current blocked sites
  function updateBlockedSitesList() {
    chrome.storage.sync.get(["blockedSites"], function (data) {
      const blockedSites = data.blockedSites || [];
      createBlockedSitesList(blockedSites, isDarkMode);
    });
  }
});

// document.addEventListener("DOMContentLoaded", function () {
//   const blockListButton = document.getElementById("blockListBtn");
//   const blockList = document.getElementById("blockList");
//   const toggleDarkModeBtn = document.getElementById("toggleModeBtn");

//   // Clicking the blockList button edirects back to home page
//   blockListButton.addEventListener("click", function () {
//     window.location.href = "../popup/popup.html";
//   });

//   // Fetch the list of blocked sites from Chrome storage
//   chrome.storage.sync.get(
//     ["blockMode", "darkMode", "blockedSites"],
//     function (data) {
//       const blockedSites = data.blockedSites || [];
//       let isDarkMode = data.darkMode !== undefined ? data.darkMode : false;

//       updateDarkMode(isDarkMode);

//       // Toggle dark mode on click
//       toggleDarkModeBtn.addEventListener("click", function () {
//         isDarkMode = !isDarkMode;
//         chrome.storage.sync.set({ darkMode: isDarkMode });
//         updateDarkMode(isDarkMode);
//       });

//       // Dynamically create list of blocked sites
//       if (blockedSites.length > 0) {
//         const ul = document.createElement("ul");

//         // Iterate over the blocked sites and create list items
//         blockedSites.forEach(function (site) {
//           const li = document.createElement("li");
//           li.textContent = site;
//           li.style.color = isDarkMode ? "gray" : "";

//           // Create delete icon
//           const deleteIcon = document.createElement("img");
//           deleteIcon.src = "../images/cross.png";
//           deleteIcon.alt = "Delete button";
//           deleteIcon.title = "Remove site from blocked list";
//           deleteIcon.classList.add("delete-icon");

//           deleteIcon.addEventListener("click", function () {
//             const indexToRemove = blockedSites.indexOf(site);
//             if (indexToRemove !== -1) {
//               blockedSites.splice(indexToRemove, 1);

//               // Update Chrome storage with the updated blockedSites array
//               chrome.storage.sync.set({ blockedSites });

//               // Refresh the blocked list
//               blockList.innerHTML = "";
//               document.dispatchEvent(new Event("DOMContentLoaded"));
//             }
//           });

//           li.appendChild(deleteIcon);
//           ul.appendChild(li);
//         });

//         // Replace the content of the blockList element with the dynamic list
//         blockList.innerHTML = "";
//         blockList.appendChild(ul);
//       } else {
//         // If there are no blocked sites, display a message
//         blockList.innerHTML =
//           "<p style='color: grey'>No sites are currently blocked.</p>";
//       }
//     }
//   );

//   function updateDarkMode(isDarkMode) {
//     if (isDarkMode) {
//       document.body.classList.add("dark-mode");
//       themeIcon.src = "../images/night-mode.png";
//     } else {
//       document.body.classList.remove("dark-mode");
//       themeIcon.src = "../images/bright-mode.png";
//     }
//   }
// });
