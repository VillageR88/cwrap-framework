import getAlter from "./getAlter.js";

export default function populateBlueprintAlterStyleOptionsValue() {
	const alter = getAlter();

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

	const selectedStyleKey =
		global.id.mainBlueprintAlterStyleSelectorPropertySelect.value;
	global.id.mainBlueprintAlterStyleSelectorInput.value =
		styleObject[selectedStyleKey] || "";
}
