import getElementFromPath from "./getElementFromPath.js";

export default function populateBlueprintStyleOptionsValue() {
	const blueprintStyleSelectValue = global.id.blueprintPropertySelect.value;
	const blueprintStyleInput = global.id.propertyBlueprintInput;
	blueprintStyleInput.value = "";
	const blueprintMap = global.map.blueprintMap;
	const selector = getElementFromPath().timeStamp;
	const currentMap = blueprintMap.get(selector);
	const selectedBlueprintElement = global.id.blueprintSelect.value;
	const selectedBlueprintElementTrimmed = selectedBlueprintElement
		.replace(">", "")
		.trim();

	function getTargetElement(map, elementPath) {
		const pathParts = elementPath.split(" > ");
		let currentElement = map;

		for (const part of pathParts) {
			const [elementName, nthOfType] = part.split(":nth-of-type(");
			const index = nthOfType
				? Number.parseInt(nthOfType.replace(")", ""), 10) - 1
				: 0;

			if (currentElement.element === elementName) {
				if (index === 0) {
					continue;
				}
			}

			if (currentElement.children && Array.isArray(currentElement.children)) {
				const matchingChildren = currentElement.children.filter(
					(child) => child.element === elementName,
				);
				if (matchingChildren.length > index) {
					currentElement = matchingChildren[index];
				} else {
					return null;
				}
			} else {
				return null;
			}
		}

		return currentElement;
	}

	const targetElement = getTargetElement(
		currentMap,
		selectedBlueprintElementTrimmed,
	);

	if (targetElement?.style && typeof targetElement.style === "string") {
		const styles = targetElement.style.split(";");
		for (const style of styles) {
			const [property, value] = style.split(":");
			if (property.trim() === blueprintStyleSelectValue.trim()) {
				blueprintStyleInput.value = value.trim();
				break;
			}
		}
	}
}
