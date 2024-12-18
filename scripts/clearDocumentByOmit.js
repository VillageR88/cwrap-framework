export default function clearDocumentByOmit() {
  const doc = global.id.doc;
  const elements = doc.body.getElementsByTagName("*");
  for (let i = elements.length - 1; i >= 0; i--) {
    if (elements[i].textContent === "cwrapOmit") {
      elements[i].parentNode.removeChild(elements[i]);
    }
  }
}
