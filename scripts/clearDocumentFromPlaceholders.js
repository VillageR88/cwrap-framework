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

  const iframe = global.id.preview;
  const iframeDocument =
    iframe.contentDocument || iframe.contentWindow.document;
  const iframeBody = iframeDocument.body;

  clearPlaceholders(iframeBody);
}
