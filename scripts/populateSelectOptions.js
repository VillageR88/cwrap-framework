import { stateNonContextual, stateContextual } from "./_const.js";

/**
 * Populates the select options with the generated CSS selectors.
 * @todo problem is probably related to cssMap
 */
export default function populateSelectOptions() {
  const cssMap = global.map.cssMap;
  const selectElement = global.id.elementSelect;





  const fullContext = stateContextual.concat(stateNonContextual);
  for (const [key, value] of cssMap) {
    if (fullContext.some((context) => key.includes(context))) continue;
    if (/(^|\s)li:nth-of-type\(\d+\)(\s|$)/.test(key)) continue;
    const option = document.createElement("option");
    option.value = key;
    option.textContent = key;
    selectElement.appendChild(option);
    // mainTemplatesSelectorParent.innerHTML = selectElement.innerHTML;
    // mainTemplatesSelectorParent.appendChild(option.cloneNode(true));
  }
}
