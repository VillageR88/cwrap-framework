export default function populateBlueprintAlterStyleOptionsSelectAll(
	cssProperties,
) {
	const selectAll =
		global.id.mainBlueprintAlterStyleSelectorStyleAddPropertyBlueprintSelectAll;
	selectAll.innerHTML = "";
	for (const property of cssProperties) {
		const option = document.createElement("option");
		option.value = property;
		option.textContent = property;
        selectAll.append(option);
	}
}
