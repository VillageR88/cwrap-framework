/**
 * @typedef {import('./types.js').JsonObject} JsonObject
 * @type {import('./_globals.js')}
 */
/**
 *
 * @param {JsonObject} jsonObj
 */
export default function loadRoot(jsonObj) {
	global.map.rootMap.clear();
	global.id.wizardRootDiv.innerHTML = "";
	if (jsonObj.root) {
		for (const [key, value] of Object.entries(jsonObj.root)) {
			global.map.rootMap.set(key, value);
		}
	}
	onLoadPopulateRootCreator();
}

/**
 * Appends elements to the global wizardRootDiv.
 * @param {Map} rootMap - A map containing key-value pairs to populate the root div.
 */
export function onLoadPopulateRootCreator() {
	global.id.wizardRootDiv.innerHTML = "";
	for (const [key, value] of global.map.rootMap) {
		const rootDiv = document.createElement("div");
		const nestedDiv1 = document.createElement("div");
		const label1 = document.createElement("label");
		const nestedDiv2 = document.createElement("div");
		const label2 = document.createElement("label");
		const labelDiv = document.createElement("div");
		const keyInput = document.createElement("input");
		const removeSvg = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"> <path d="m376-300 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Zm-96 180q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Zm-400 0v520-520Z" /> </svg>`;
		const removeButton = document.createElement("button");
		removeButton.innerHTML = removeSvg;
		const rootInput = document.createElement("input");

		labelDiv.classList.add(global.class.labelDiv);
		label1.htmlFor = key;
		label1.textContent = "Variable name";
		labelDiv.appendChild(label1);

		removeButton.classList.add(global.class.mediumButtons);
		removeButton.type = "button";
		removeButton.ariaLabel = "remove variable";
		removeButton.dataset.title = "remove variable";
		removeButton.addEventListener("click", () => {
			global.map.rootMap.delete(key);
			onLoadPopulateRootCreator();
		});
		labelDiv.appendChild(removeButton);

		nestedDiv1.appendChild(labelDiv);
		keyInput.id = key;
		keyInput.value = key;
		keyInput.classList.add("root-name");
		nestedDiv1.appendChild(keyInput);

		rootDiv.appendChild(nestedDiv1);

		label2.htmlFor = value;
		label2.textContent = "Variable value";
		nestedDiv2.appendChild(label2);

		rootInput.id = value;
		rootInput.type = "text";
		rootInput.value = value;
		rootInput.classList.add("root-value");
		nestedDiv2.appendChild(rootInput);

		rootDiv.appendChild(nestedDiv2);

		global.id.wizardRootDiv.appendChild(rootDiv);
	}
}
