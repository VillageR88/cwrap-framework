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
function onLoadPopulateRootCreator() {
	for (const [key, value] of global.map.rootMap) {
		const rootDiv = document.createElement("div");
		const nestedDiv1 = document.createElement("div");
		const label1 = document.createElement("label");
		const nestedDiv2 = document.createElement("div");
		const label2 = document.createElement("label");
		const labelDiv = document.createElement("div");
		const keyInput = document.createElement("input");
		const removeButton = document.createElement("button");
		const rootInput = document.createElement("input");

		labelDiv.classList.add(global.class.labelDiv);
		label1.htmlFor = key;
		label1.textContent = "Variable name";
		labelDiv.appendChild(label1);

		removeButton.classList.add(global.class.mediumButtons, global.class.remove);
		removeButton.type = "button";
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
