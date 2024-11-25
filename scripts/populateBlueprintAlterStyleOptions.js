import getAlter from "./getAlter.js";

/**
 * Also fills selected value
 */
export default function populateBlueprintAlterStyleOptions() {
	const alter = getAlter();
	if (!alter.enumReference.style) {
		alter.enumReference.style = "";
	}
	/** @type {Record<string, string>} */
	const styleObject = Object.fromEntries(
		alter.enumReference.style
			.split(";")
			.filter(Boolean)
			.map((item) => {
				const key = item.match(/^.+(?=:)/)[0].trim();
				const value = item.match(/(?<=:).+/)[0].trim();
				return [key, value];
			}),
	);

	global.id.mainBlueprintAlterStyleSelectorPropertySelect.innerHTML = "";
	for (const styleKey in styleObject) {
		const option = document.createElement("option");
		option.value = styleKey;
		option.textContent = styleKey;
		global.id.mainBlueprintAlterStyleSelectorPropertySelect.append(option);
	}

	const selectedStyleKey =
		global.id.mainBlueprintAlterStyleSelectorPropertySelect.value;
	global.id.mainBlueprintAlterStyleSelectorInput.value =
		styleObject[selectedStyleKey] || "";
}
