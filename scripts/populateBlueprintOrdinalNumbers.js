import getElementFromPath from "./getElementFromPath.js";
export default function populateBlueprintOrdinalNumbers() {
	const blueprintMap = global.map.blueprintMap;
	const selector = getElementFromPath().timeStamp;
	const currentMap = blueprintMap.get(selector);
	const count = currentMap.count;
    global.id.mainBlueprintAlterSelectorSelect.innerHTML = "";
	for (let i = 1; i <= count; i++) {
       const option = document.createElement("option");
       option.value = i;
       option.textContent = i;
       global.id.mainBlueprintAlterSelectorSelect.append(option);
    }
}
