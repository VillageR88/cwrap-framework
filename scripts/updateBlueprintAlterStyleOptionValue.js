import getAlter from "./getAlter.js";

export default function addBlueprintAlterStyleOption() {
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
    console.log(styleObject);

	styleObject[
		global.id.mainBlueprintAlterStyleSelectorPropertySelect.value
	] = global.id.mainBlueprintAlterStyleSelectorInput.value;
    console.log(styleObject);
	const styleString = Object.entries(styleObject)
		.map(([key, value]) => `${key}: ${value}`)
		.join("; ")
		.concat(";");
	alter.enumReference.style = styleString;
}
