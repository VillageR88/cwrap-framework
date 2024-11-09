import getElementFromPath from "./getElementFromPath.js";
import createElementFromJson from "./createElementFromJson.js";
import { replacePlaceholdersCwrapArray, replacePlaceholdersCwrapIndex } from "./replaceBlueprintJsonPlaceholders.js";

export default function reloadBlueprint() {
    const blueprintMap = global.map.blueprintMap;
    const selector = getElementFromPath().timeStamp;
    const currentMap = blueprintMap.get(selector);
    const currentElement = getElementFromPath();
    currentElement.innerHTML = "";

    for (let i = 0; i < currentMap.count; i++) {
        let updatedElement = JSON.parse(JSON.stringify(currentMap));
        updatedElement = replacePlaceholdersCwrapIndex(updatedElement, i);
        updatedElement = replacePlaceholdersCwrapArray(updatedElement, i);

        const elementNode = createElementFromJson(updatedElement);
        elementNode.customTag = "cwrapBlueprint"; // here was error in previous commit just gonna leave here this comment for a while
        currentElement.appendChild(elementNode);
    }
}