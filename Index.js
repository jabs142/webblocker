const generateHTML = (pageName) => {
  // Create a temporary URL object to extract the hostname
  const tempUrl = new URL(`http://${pageName}`);
  // Extract the hostname, remove "www." and ".com", and convert to lowercase
  const siteName = tempUrl.hostname
    .replace(/^www\./, "")
    .replace(/\..*$/, "")
    .toLowerCase();
  // Capitalize the first letter of the site name
  const capitalizedSiteName =
    siteName.charAt(0).toUpperCase() + siteName.slice(1);

  return `
      <div class='c'>
          <div class='_404'>404</div>
          <hr>
          <div class='_1'>GET BACK TO WORK</div>
          <div class='_2'> No time for ${capitalizedSiteName}</div>
      </div>
    `;
};

const blockedSites = ["www.youtube.com", "www.netflix.com", "www.facebook.com"];

const currentHostname = window.location.hostname;

if (blockedSites.includes(currentHostname)) {
  const style = document.createElement("style");
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
  
      ._404 {
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
