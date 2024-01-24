const generateHTML = (pageName) => {
  const tempUrl = new URL(`http://${pageName}`);
  const siteName = tempUrl.hostname
    .replace(/^www\./, "")
    .replace(/\..*$/, "")
    .toLowerCase();
  const capitalizedSiteName =
    siteName.charAt(0).toUpperCase() + siteName.slice(1);

  return `
    <div class='c' data-blocking-html>
        <div class='_stop'>STOP</div>
        <hr>
        <div class='_1'>GET BACK TO WORK</div>
    <div class='_2'> No time for ${capitalizedSiteName}</div>
</div>
  `;
};

const blockedSites = ["www.youtube.com", "www.netflix.com", "www.facebook.com"];
const currentHostname = window.location.hostname;

// Primarily for retrieving stored data for persisting settings or user preferences across sessions.
chrome.storage.sync.get("blockMode", function (data) {
  const isBlocked = data.blockMode !== undefined ? data.blockMode : true;
  updateBlockedSites(isBlocked);
});

// Listens for communication between different components of the extension
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.blockMode !== undefined) {
    const isBlocked = request.blockMode;
    updateBlockedSites(isBlocked);
  }
});

function applyBlockingLogic() {
  const style = document.createElement("style");
  style.setAttribute("data-blocking-styles", "");

  style.innerHTML = `
      body {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
        margin: 0;
        background-color: #f8f9fa;
      }
  
      .c {
        text-align: center;
        font-family: 'Arial', sans-serif;
        color: #495057;
      }
  
      ._stop {
        font-size: 6em;
        font-weight: bold;
        color: #dc3545;
      }
  
      ._1 {
        font-size: 1.5em;
        margin: 10px 0;
      }
  
      ._2 {
        font-size: 1.2em;
        color: #6c757d;
      }
    `;

  document.head.appendChild(style);

  document.body.innerHTML = generateHTML(currentHostname.toUpperCase());
}

// TO DO: Fix the bug when switching back from focus to surf mode
// Current fix is to add a reload - not ideal

function removeBlockingLogic() {
  const blockingElement = document.body.querySelector(".c[data-blocking-html]");

  if (blockingElement) {
    blockingElement.remove();
    location.reload();
  }

  const blockingStyles = document.head.querySelector(
    "style[data-blocking-styles]"
  );

  if (blockingStyles) {
    blockingStyles.remove();
  }

  console.log(
    "Blocking logic removed. Users can now use their browsers as usual."
  );
}

// TODO: Fix logic. Add recently blocked site into blockedSites array
function updateBlockedSites(isBlocked) {
  //   chrome.storage.sync.get("blockedSites", function (data) {
  //     const blockedSites = data.blockedSites || []; // If blockedSites is undefined, use an empty array

  if (isBlocked && blockedSites.includes(currentHostname)) {
    applyBlockingLogic();
  } else {
    removeBlockingLogic();
  }
  //   });
}
