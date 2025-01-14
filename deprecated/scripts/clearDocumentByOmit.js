export default function clearDocumentByOmit(bodyElement) {
  const elements = bodyElement.getElementsByTagName("*");
  for (let i = elements.length - 1; i >= 0; i--) {
    if (elements[i].textContent.includes("cwrapOmit")) {
      console.log(elements[i])
      elements[i].parentNode.removeChild(elements[i]);
    }
  }
}
