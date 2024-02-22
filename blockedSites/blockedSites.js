document.addEventListener("DOMContentLoaded", function () {
  const blockListButton = document.getElementById("blockListBtn");
  const blockList = document.getElementById("blockList");
  const toggleDarkModeBtn = document.getElementById("toggleModeBtn");

  // Add a click event listener to the button and redirect to popup page
  blockListButton.addEventListener("click", function () {
    window.location.href = "../popup/popup.html";
  });

  // Fetch the list of blocked sites from Chrome storage
  chrome.storage.sync.get(
    ["blockMode", "darkMode", "blockedSites"],
    function (data) {
      const blockedSites = data.blockedSites || [];
      let isDarkMode = data.darkMode !== undefined ? data.darkMode : false;

      updateDarkMode(isDarkMode);

      // Toggle dark mode on click
      toggleDarkModeBtn.addEventListener("click", function () {
        isDarkMode = !isDarkMode;
        chrome.storage.sync.set({ darkMode: isDarkMode });
        updateDarkMode(isDarkMode);
      });

      // Check if there are blocked sites
      if (blockedSites.length > 0) {
        // Create an unordered list element
        const ul = document.createElement("ul");

        // Iterate over the blocked sites and create list items
        blockedSites.forEach(function (site) {
          const li = document.createElement("li");
          li.textContent = site;

          // Create delete icon
          const deleteIcon = document.createElement("img");
          deleteIcon.src = "../images/cross.png";
          deleteIcon.alt = "Delete button";
          deleteIcon.title = "Remove site from blocked list";
          deleteIcon.classList.add("delete-icon");

          // Add click event listener to the delete icon
          deleteIcon.addEventListener("click", function () {
            // Remove the corresponding site from the blockedSites array
            const indexToRemove = blockedSites.indexOf(site);
            if (indexToRemove !== -1) {
              blockedSites.splice(indexToRemove, 1);

              // Update Chrome storage with the updated blockedSites array
              chrome.storage.sync.set({ blockedSites });

              // Refresh the blocked list
              blockList.innerHTML = "";
              document.dispatchEvent(new Event("DOMContentLoaded"));
            }
          });

          // Append the delete icon to the list item
          li.appendChild(deleteIcon);

          // Append the list item to the unordered list
          ul.appendChild(li);
        });

        // Replace the content of the blockList element with the dynamic list
        blockList.innerHTML = "";
        blockList.appendChild(ul);
      } else {
        // If there are no blocked sites, display a message
        blockList.innerHTML =
          "<p style='color: grey'>No sites are currently blocked.</p>";
      }
    }
  );

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
