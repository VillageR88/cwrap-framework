export default function populateAttributeOptionsValue() {
  const body = document.getElementById("preview").contentWindow.document.body;
  const selector = document.getElementById("elementSelect");
  const selectedAttribute = document.getElementById("attributeSelect").value;
  const attributeInput = document.getElementById("attributeInput");
  if (!selector || !selectedAttribute || !attributeInput) {
    attributeInput.value = "";
    return;
  }
  const element = body.querySelector(selector.value);
  attributeInput.value = element.getAttribute(selectedAttribute);
}
