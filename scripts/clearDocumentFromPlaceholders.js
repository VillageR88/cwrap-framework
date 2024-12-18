export default function clearDocumentFromPlaceholders() {

  function clearPlaceholders(element) {
    if (element.isPlaceholder) {
      element.remove();
      return;
    }

    for (const child of Array.from(element.children)) {
      clearPlaceholders(child);
    }
  }

  function removePlaceholderText(doc) {
    const elements = doc.body.getElementsByTagName("*");
    for (let i = elements.length - 1; i >= 0; i--) {
      if (elements[i].textContent.includes("cwrapPlaceholder")) {
        elements[i].textContent = elements[i].textContent.replace("cwrapPlaceholder", "");
      }
    }
  }

  const iframe = global.id.preview;
  const iframeDocument =
    iframe.contentDocument || iframe.contentWindow.document;
  const iframeBody = iframeDocument.body;

  clearPlaceholders(iframeBody);
  removePlaceholderText(iframeDocument);
}