export default function updatePropertySelectOptions() {
	const fullPath = global.id.elementSelect.value;
	const cssMap = global.map.cssMap;
	const propertySelect = global.id.propertySelect;
	const currentStyle = cssMap.get(fullPath) || "";

	const styleProperties = currentStyle
		.split(";")
		.filter(Boolean)
		.map((prop) => prop.trim());

	propertySelect.innerHTML = "";
	for (const prop of styleProperties) {
		const [key] = prop.split(":").map((item) => item.trim());
		const option = document.createElement("option");
		option.value = key;
		option.textContent = key;
		propertySelect.appendChild(option);
	}

	const propertyInput = global.id.propertyInput;
	const selectedProperty = propertySelect.value;
	const selectedValue =
		styleProperties.length > 0
			? styleProperties
					.find((prop) => prop.startsWith(selectedProperty))
					.split(":")[1]
					.trim()
			: "";
	propertyInput.value = selectedValue;
}
