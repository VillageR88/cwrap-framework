/**
 * Populates the select options with the generated CSS selectors.
 *
 * @param {Map} cssMap - The Map object containing CSS selectors and styles.
 * @returns {void}
 */
export default function populateSelectOptions(cssMap) {
  const selectElement = document.getElementById("elementSelect");
  selectElement.innerHTML = "";
  for (const [key, value] of cssMap) {
    if (key.includes(":has") || key.includes(":hover")) continue;
    const option = document.createElement("option");
    option.value = key;
    option.textContent = key;
    selectElement.appendChild(option);
  }
}
