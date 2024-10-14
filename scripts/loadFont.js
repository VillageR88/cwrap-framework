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
					const removeSvg = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"> <path d="m376-300 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Zm-96 180q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Zm-400 0v520-520Z" /> </svg>`;
					const removeButton = document.createElement("button");
					removeButton.innerHTML = removeSvg;
					removeButton.classList.add("mediumButtons");
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
