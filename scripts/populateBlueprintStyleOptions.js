import getElementFromPath from "./getElementFromPath.js";

export default function populateBlueprintStyleOptions(isState = false) {
    const blueprintStyleSelect = isState ? global.id.stateBlueprintPropertySelect : global.id.blueprintPropertySelect;
    blueprintStyleSelect.innerHTML = "";
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

    if (isState) {
        if (targetElement?.extend && Array.isArray(targetElement.extend)) {
            for (const extension of targetElement.extend) {
                if (extension.style && typeof extension.style === "string") {
                    const styles = extension.style.split(";");
                    for (const style of styles) {
                        const [property] = style.split(":");
                        if (property.trim()) {
                            const newOption = new Option(property.trim(), property.trim());
                            blueprintStyleSelect.appendChild(newOption);
                        }
                    }
                }
            }
        }
    } else {
        if (targetElement?.style && typeof targetElement.style === "string") {
            const styles = targetElement.style.split(";");
            for (const style of styles) {
                const [property] = style.split(":");
                if (property.trim()) {
                    const newOption = new Option(property.trim(), property.trim());
                    blueprintStyleSelect.appendChild(newOption);
                }
            }
        }
    }
}