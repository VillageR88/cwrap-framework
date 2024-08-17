function loadPreview() {
  const preview = document.getElementById("preview");

  fetch("templates/skeletonBody.html")
    .then((response) => response.text())
    .then((data) => {
      preview.innerHTML = data;
    })
    .catch((error) => console.error("Error loading preview:", error));
}

loadPreview();
