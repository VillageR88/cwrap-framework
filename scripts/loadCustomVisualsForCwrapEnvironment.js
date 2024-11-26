export default function loadCustomVisualsForCwrapEnvironment() {
	const selectElement = global.id.elementSelect;
	const mainTemplatesSelectorParent = global.id.mainTemplatesSelectorParent;
	const treeViewEdit = global.id.treeViewEdit;
	const navScreenCustom = global.id.navScreenCustom;

	mainTemplatesSelectorParent.innerHTML = "";
	selectElement.innerHTML = "";
	treeViewEdit.innerHTML = "";
	navScreenCustom.innerHTML = "";

	const colorFill = document.documentElement.style.getPropertyValue(
		"--colorFill-regular",
	);
	const svgListTemplate = `
		<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="${colorFill}">
			<path d="M280-600v-80h560v80H280Zm0 160v-80h560v80H280Zm0 160v-80h560v80H280ZM160-600q-17 0-28.5-11.5T120-640q0-17 11.5-28.5T160-680q17 0 28.5 11.5T200-640q0 17-11.5 28.5T160-600Zm0 160q-17 0-28.5-11.5T120-480q0-17 11.5-28.5T160-520q17 0 28.5 11.5T200-480q0 17-11.5 28.5T160-440Zm0 160q-17 0-28.5-11.5T120-320q0-17 11.5-28.5T160-360q17 0 28.5 11.5T200-320q0 17-11.5 28.5T160-280Z"/>
		</svg>`;
	const editTemplate = `<svg xmlns="http://www.w3.org/2000/svg" fill="${colorFill}" height="24px" viewBox="0 -960 960 960" width="24px">
              <path
                d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
            </svg>`;
	const customScreenTemplate = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="${colorFill}"><path d="M280-160H160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640v80H160v480h120v80Zm160-100q25 0 42.5-17.5T500-320q0-25-17.5-42.5T440-380q-25 0-42.5 17.5T380-320q0 25 17.5 42.5T440-260Zm-80 100v-71q-19-17-29.5-40T320-320q0-26 10.5-49t29.5-40v-71h160v71q19 17 29.5 40t10.5 49q0 26-10.5 49T520-231v71H360Zm480 0H640q-17 0-28.5-11.5T600-200v-360q0-17 11.5-28.5T640-600h200q17 0 28.5 11.5T880-560v360q0 17-11.5 28.5T840-160Zm-160-80h120v-280H680v280Zm0 0h120-120Z"/></svg>`;

	const svgDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(
		svgListTemplate,
	)}`;
	const editDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(
		editTemplate,
	)}`;
	const customScreenDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(
		customScreenTemplate,
	)}`;

	selectElement.style.backgroundImage = `url("${svgDataUrl}")`;
	selectElement.style.backgroundSize = "24px 24px";
	selectElement.style.backgroundRepeat = "no-repeat";

	mainTemplatesSelectorParent.style.backgroundImage = `url("${svgDataUrl}")`;
	mainTemplatesSelectorParent.style.backgroundSize = "24px 24px";
	mainTemplatesSelectorParent.style.backgroundRepeat = "no-repeat";

	treeViewEdit.style.backgroundImage = `url("${editDataUrl}")`;
	treeViewEdit.style.backgroundSize = "24px 24px";
	treeViewEdit.style.backgroundRepeat = "no-repeat";

	navScreenCustom.style.backgroundImage = `url("${customScreenDataUrl}")`;
	navScreenCustom.style.backgroundSize = "24px 24px";
	navScreenCustom.style.backgroundRepeat = "no-repeat";
}
