import getElementFromPath from "./getElementFromPath.js";
import createElementFromJson from "./createElementFromJson.js";

export default function reloadBlueprint() {
	const blueprintMap = global.map.blueprintMap;
	const selector = getElementFromPath().timeStamp;
	const currentMap = blueprintMap.get(selector);
	const currentElementChildrenBlueprintReplacement =
		createElementFromJson(currentMap);
	const currentElement = getElementFromPath();
	currentElement.innerHTML = "";
	for (let i = 0; i < currentMap.count; i++) {
		const placeholder = "cwrapIndex";
		const regex = new RegExp(`${placeholder}(\\+\\d+)?`, "g");
		const index = i;
		const updatedElement =
			currentElementChildrenBlueprintReplacement.cloneNode(true);
		updatedElement.innerHTML = updatedElement.innerHTML.replace(
			regex,
			(match) => {
				if (match === placeholder) {
					return index;
				}
				const offset = Number.parseInt(match.replace(placeholder, ""), 10);
				return index + offset;
			},
		);
		updatedElement.customTag = "cwrapBlueprint"; // here was error in previous commit just gonna leave here this comment for a while
		currentElement.appendChild(updatedElement);
	}
}
