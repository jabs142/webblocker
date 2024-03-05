console.log("This is content.js!");

// const generateHTML = (pageName) => {
//   const tempUrl = new URL(`http://${pageName}`);
//   const siteName = tempUrl.hostname
//     .replace(/^www\./, "")
//     .replace(/\..*$/, "")
//     .toLowerCase();
//   const capitalizedSiteName =
//     siteName.charAt(0).toUpperCase() + siteName.slice(1);

//   return `
//       <div class='c' data-blocking-html>
//           <div class='_stop'>STOP</div>
//           <hr>
//           <div class='_1'>GET BACK TO WORK</div>
//       <div class='_2'> No time for ${capitalizedSiteName}</div>
//   </div>
//     `;
// };

// function applyBlockingLogic() {
//   const style = document.createElement("style");
//   style.setAttribute("data-blocking-styles", "");

//   style.innerHTML = `
//         body {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           height: 100vh;
//           margin: 0;
//           background-color: #f8f9fa;
//         }

//         .c {
//           text-align: center;
//           font-family: 'Arial', sans-serif;
//           color: #495057;
//         }

//         ._stop {
//           font-size: 6em;
//           font-weight: bold;
//           color: #dc3545;
//         }

//         ._1 {
//           font-size: 1.5em;
//           margin: 10px 0;
//         }

//         ._2 {
//           font-size: 1.2em;
//           color: #6c757d;
//         }
//       `;

//   document.head.appendChild(style);

//   document.body.innerHTML = generateHTML(currentHostname.toUpperCase());
// }

// applyBlockingLogic();

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   if (request.action === "blockSite") {
//     const blockedMessage = document.createElement("div");
//     blockedMessage.innerHTML = "<p>This site is blocked during focus time.</p>";
//     blockedMessage.style.position = "fixed";
//     blockedMessage.style.top = "50%";
//     blockedMessage.style.left = "50%";
//     blockedMessage.style.transform = "translate(-50%, -50%)";
//     blockedMessage.style.backgroundColor = "#fff";
//     blockedMessage.style.padding = "20px";
//     blockedMessage.style.border = "2px solid #000";
//     blockedMessage.style.zIndex = "9999";
//     document.body.appendChild(blockedMessage);

//     // Send a response to acknowledge that the message was received
//     sendResponse({ received: true });
//   }
// });
