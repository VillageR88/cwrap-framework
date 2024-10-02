/**
 * @typedef {import('./types.js').JsonObject} JsonObject
 * @typedef {import('./_globals.js')}
 */
/**
 *
 * @param {JsonObject} jsonObj
 * @param {Map} fontMap
 */
export default function loadFont(jsonObj) {
	global.map.fontMap.clear();
	global.id.wizardFontsDiv.innerHTML = "";
	if (jsonObj.fonts) {
		if (!global.map.fontMap.has("fonts")) {
			global.map.fontMap.set("fonts", []);
		}
		for (const [key, value] of Object.entries(jsonObj.fonts)) {
			global.map.fontMap.get("fonts").push(value);
		}
	}
	onLoadPopulateFontsCreator(global.map.fontMap);
}

function onLoadPopulateFontsCreator() {
	for (const [key, value] of global.map.fontMap) {
		for (const [subKey, subValue] of Object.entries(value)) {
			const fontDiv = document.createElement("div");
			const labelDiv = document.createElement("div");
			labelDiv.classList.add("labelDiv");
			for (const [subSubKey, subSubValue] of Object.entries(subValue)) {
				const wrapperDiv = document.createElement("div");
				const FontTitle = document.createElement("label");
				FontTitle.htmlFor = `${key}.${Number(subKey) + 1}.${subSubKey}`;

				if (subSubKey === "font-family") FontTitle.textContent = "Font family";
				else if (subSubKey === "src") FontTitle.textContent = "Font source";
				else if (subSubKey === "font-display")
					FontTitle.textContent = "Font display";
				if (subSubKey === "font-family") {
					labelDiv.appendChild(FontTitle);
					const removeButton = document.createElement("button");
					removeButton.classList.add("mediumButtons", "remove");
					removeButton.type = "button";
					labelDiv.appendChild(removeButton);
					fontDiv.appendChild(labelDiv);
				} else wrapperDiv.appendChild(FontTitle);
				const FontInput = document.createElement("input");
				FontInput.id = `${key}.${Number(subKey) + 1}.${subSubKey}`;
				FontInput.classList.add(`${subSubKey}`);
				FontInput.type = "text";
				FontInput.value = subSubValue;
				wrapperDiv.appendChild(FontInput);
				fontDiv.appendChild(wrapperDiv);
			}
			global.id.wizardFontsDiv.appendChild(fontDiv);
		}
	}
}
