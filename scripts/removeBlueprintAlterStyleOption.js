import getAlter from "./getAlter.js";

export default function removeBlueprintAlterStyleOption() {
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
	delete styleObject[
		global.id.mainBlueprintAlterStyleSelectorPropertySelect.value
	];
	let styleString = Object.entries(styleObject)
		.map(([key, value]) => `${key}: ${value}`)
		.join("; ")
		.concat(";");
	if (styleString.replaceAll(";", "").trim() === "") styleString = "";
	alter.enumReference.style = styleString;
}
