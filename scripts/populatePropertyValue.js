/**
 *
 * @param {string} [path]
 */
export default function populatePropertyValue(path, isState) {
	const cssMap = global.map.cssMap;
	const propertyInput = isState
		? global.id.statePropertyInput
		: global.id.propertyInput;
	const propertySelect = isState
		? global.id.statePropertySelect
		: global.id.propertySelect;
	let selectedValue = "";
	const fullPath =
		path || isState
			? global.id.elementStateSelect.value
			: global.id.elementSelect.value;
	const currentStyle = cssMap.get(fullPath) || "";
	const styleProperties = currentStyle
		.split(";")
		.map((prop) => prop.trim())
		.filter(Boolean);
	if (currentStyle)
		selectedValue =
			styleProperties.length > 0
				? styleProperties
						.find((prop) => prop.startsWith(propertySelect.value))
						?.split(":")[1]
						.trim()
				: "";
	const propertySelectMemory = propertySelect.value;
	propertySelect.innerHTML = "";
	let firstOption;
	for (const prop of styleProperties) {
		const [key, value] = prop.split(":").map((item) => item.trim());
		const option = document.createElement("option");
		option.value = key;
		option.textContent = key;
		if (!firstOption) {
			firstOption = key;
		}
		// Append the option element to the property select element
		propertySelect.appendChild(option);
		if (key === propertySelect) {
			selectedValue = value;
		}
	}
	if (
		Array.from(propertySelect.options)
			.map((option) => option.value)
			.includes(propertySelectMemory)
	) {
		propertySelect.value = propertySelectMemory
			? propertySelectMemory
			: firstOption;
		propertyInput.value = selectedValue;
	} else {
		propertySelect.value = Array.from(propertySelect.options).map(
			(option) => option.value,
		)[0];
		const firstValue = cssMap.get(fullPath).split(";")[0].split(":")[1];
		propertyInput.value = firstValue ? firstValue : "";
	}
}
