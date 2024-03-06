// Function declaration for generateHTML
function generateHTML(pageName) {
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
}

function applyBlockingLogic() {
  // Check if blocking HTML is already injected
  if (document.querySelector("[data-blocking-html]")) {
    return;
  }

  const currentHostname = window.location.hostname;

  const existingStyle = document.querySelector("[data-blocking-styles]");
  if (!existingStyle) {
    const style = document.createElement("style");
    style.setAttribute("data-blocking-styles", "");

    style.innerHTML = `
    body {
      overflow: hidden;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      margin: 0;
      background-color: #f8f9fa;
      display: flex;
      align-items: center;
      justify-content: center;
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
  }

  document.body.innerHTML = generateHTML(currentHostname.toUpperCase());
}

applyBlockingLogic();
