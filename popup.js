document.addEventListener("DOMContentLoaded", function () {
  const toggleBtn = document.getElementById("toggleBtn");

  // Retrieve the current mode from storage only once when the DOM is loaded
  chrome.storage.sync.get("blockMode", function (data) {
    let isBlocked = data.blockMode !== undefined ? data.blockMode : true;
    updateButtonText(isBlocked);

    // Toggle the mode on button click
    toggleBtn.addEventListener("click", function () {
      // Invert the value of isBlocked
      isBlocked = !isBlocked;

      // Update the storage with the new mode
      chrome.storage.sync.set({ blockMode: isBlocked });

      // Update the button text
      updateButtonText(isBlocked);

      // Notify content script to update the blocked sites logic
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
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
      });
    });
  });

  function updateButtonText(isBlocked) {
    toggleBtn.textContent = isBlocked ? "Focus Mode" : "Surf Mode";
  }
});
