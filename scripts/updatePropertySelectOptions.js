export default function updatePropertySelectOptions(isState) {
	console.log("updatePropertySelectOptions() called");

	const fullPath = isState
		? global.id.elementStateSelect.value
		: global.id.elementSelect.value;
	const cssMap = global.map.cssMap;
	const propertySelect = isState
		? global.id.statePropertySelect
		: global.id.propertySelect;
	const currentStyle = cssMap.get(fullPath) || "";
	console.log("updatePropertySelectOptions.js: currentStyle", currentStyle);

	const styleProperties = currentStyle
		.split(";")
		.filter(Boolean)
		.map((prop) => prop.trim());
	console.log("styleProperties", styleProperties);

	propertySelect.innerHTML = "";
	for (const prop of styleProperties) {
		const [key] = prop.split(":").map((item) => item.trim());
		const option = document.createElement("option");
		option.value = key;
		option.textContent = key;
		propertySelect.appendChild(option);
	}
	console.log("updatePropertySelectOptions.js: propertySelect", propertySelect);

	const propertyInput = global.id.propertyInput;
	const selectedProperty = propertySelect.value;
	const selectedValue =
		styleProperties.length > 0
			? styleProperties
					.find((prop) => prop.startsWith(selectedProperty))
					.split(":")[1]
					.trim()
			: "";
	propertySelect.value = selectedProperty;
	propertyInput.value = selectedValue;
}
