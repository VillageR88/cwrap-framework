export default function populateHeadSelectElement(headMap) {
	const headAttributeDiv = global.id.headAttributeDiv;
	const headSelectOptionValue = global.id.headSelectOption.value;
	const headSelectAttribute = global.id.headSelectAttribute;
	const headInput = global.id.headInput;
	headSelectAttribute.innerHTML = "";
	headInput.value = "";
	let headRow;
	let selector;
	if (headSelectOptionValue.includes(".")) {
		headAttributeDiv.style.display = "flex";
		headSelectAttribute.style.display = "flex";
		headRow = headMap.get(headSelectOptionValue.split(".")[0]);
		selector = Number(headSelectOptionValue.split(".")[1]);

		for (const [key, value] of Object.entries(headRow[selector - 1])) {
			if (!headInput.value) {
				headInput.value = value || "no value";
			}
			const option = document.createElement("option");
			option.value = key;
			option.textContent = key;
			headSelectAttribute.appendChild(option);
		}
	} else {
		headAttributeDiv.style.display = "none";
		headSelectAttribute.style.display = "none";
		headRow = headMap.get(headSelectOptionValue);
		headInput.value = headRow;
	}
}
