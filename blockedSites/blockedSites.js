document.addEventListener("DOMContentLoaded", function () {
  const blockListButton = document.getElementById("blockListBtn");

  // Add a click event listener to the button
  blockListButton.addEventListener("click", function () {
    // Redirect to the desired HTML page
    window.location.href = "../popup.html";
  });
});
