document.addEventListener("DOMContentLoaded", function () {
  const blockListButton = document.getElementById("blockListBtn");
  const blockList = document.getElementById("blockList");

  // Add a click event listener to the button
  blockListButton.addEventListener("click", function () {
    // Redirect to the desired HTML page
    window.location.href = "../popup.html";
  });

  // Fetch the list of blocked sites from Chrome storage
  chrome.storage.sync.get("blockedSites", function (data) {
    const blockedSites = data.blockedSites || [];

    // Check if there are blocked sites
    if (blockedSites.length > 0) {
      // Create an unordered list element
      const ul = document.createElement("ul");

      // Iterate over the blocked sites and create list items
      blockedSites.forEach(function (site) {
        const li = document.createElement("li");
        li.textContent = site;
        ul.appendChild(li);
      });

      // Replace the content of the blockList element with the dynamic list
      blockList.innerHTML = "";
      blockList.appendChild(ul);
    } else {
      // If there are no blocked sites, display a message
      blockList.innerHTML = "<p>No sites are currently blocked.</p>";
    }
  });
});
