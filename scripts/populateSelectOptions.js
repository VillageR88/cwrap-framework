import { stateNonContextual, stateContextual } from "./_const.js";

/**
 * Populates the select options with the generated CSS selectors.
 * @todo problem is probably related to cssMap
 */
export default function populateSelectOptions() {
  const cssMap = global.map.cssMap;
  const selectElement = global.id.elementSelect;
  const mainTemplatesSelectorParent = global.id.mainTemplatesSelectorParent;
  const treeViewEdit = global.id.treeViewEdit;
  mainTemplatesSelectorParent.innerHTML = "";
  selectElement.innerHTML = "";
  treeViewEdit.innerHTML = "";

  //root color for style root var --colorFill
  const colorFill = document.documentElement.style.getPropertyValue(
    "--colorFill-regular"
  );
  const svgListTemplate = `
		<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="${colorFill}">
			<path d="M280-600v-80h560v80H280Zm0 160v-80h560v80H280Zm0 160v-80h560v80H280ZM160-600q-17 0-28.5-11.5T120-640q0-17 11.5-28.5T160-680q17 0 28.5 11.5T200-640q0 17-11.5 28.5T160-600Zm0 160q-17 0-28.5-11.5T120-480q0-17 11.5-28.5T160-520q17 0 28.5 11.5T200-480q0 17-11.5 28.5T160-440Zm0 160q-17 0-28.5-11.5T120-320q0-17 11.5-28.5T160-360q17 0 28.5 11.5T200-320q0 17-11.5 28.5T160-280Z"/>
		</svg>`;
  const editTemplate = `<svg xmlns="http://www.w3.org/2000/svg" fill="${colorFill}" height="24px" viewBox="0 -960 960 960" width="24px">
              <path
                d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
            </svg>`;
  const svgDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(
    svgListTemplate
  )}`;
  const editDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(
    editTemplate
  )}`;
  selectElement.style.backgroundImage = `url("${svgDataUrl}")`;
  selectElement.style.backgroundSize = "24px 24px"; // Adjust size as needed
  selectElement.style.backgroundRepeat = "no-repeat";

  mainTemplatesSelectorParent.style.backgroundImage = `url("${svgDataUrl}")`;
  mainTemplatesSelectorParent.style.backgroundSize = "24px 24px"; // Adjust size as needed
  mainTemplatesSelectorParent.style.backgroundRepeat = "no-repeat";

  treeViewEdit.style.backgroundImage = `url("${editDataUrl}")`;
  treeViewEdit.style.backgroundSize = "24px 24px"; // Adjust size as needed
  treeViewEdit.style.backgroundRepeat = "no-repeat";

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
