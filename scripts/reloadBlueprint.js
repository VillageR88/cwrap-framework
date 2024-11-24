import getElementFromPath from "./getElementFromPath.js";
import createElementFromJson from "./createElementFromJson.js";
import {
    replacePlaceholdersCwrapArray,
    replacePlaceholdersCwrapIndex,
} from "./replaceBlueprintJsonPlaceholders.js";

export default function reloadBlueprint() {
    const blueprintMap = global.map.blueprintMap;
    const selector = getElementFromPath().timeStamp;
    const currentMap = blueprintMap.get(selector);
    const currentElement = getElementFromPath();
    currentElement.innerHTML = "";
    // Wrap the JSON object in a blueprint key
    const blueprintWrapper = {
        element: currentElement.tagName.toLowerCase(),
        blueprint: currentMap
    };

    // Recreate the entire blueprint element using createElementFromJson
    const elementNode = createElementFromJson(blueprintWrapper, false);
    currentElement.replaceWith(elementNode);
}