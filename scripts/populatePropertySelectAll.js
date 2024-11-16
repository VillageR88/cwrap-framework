import getElementFromPath from "./getElementFromPath.js";
/**
 * Populates the state property or property select element with all available CSS properties
 * that are not currently applied to the element specified by the full path.
 *
 * @param {Array} cssProperties - The array containing all CSS properties.
 * @param {boolean} isState - The boolean indicating whether the state property select element.
 * @param {boolean} isBlueprint - The boolean indicating whether the blueprint property select element.
 */
export default function populatePropertySelectAll(
	cssProperties,
	isState = false,
	isBlueprint = false,
) {
	console.log("populatePropertySelectAll called with parameters:", {
		cssProperties,
		isState,
		isBlueprint,
	});

	const cssMap = global.map.cssMap;
	const mediaQueriesMap = global.map.mediaQueriesMap;
	const blueprintMap = global.map.blueprintMap;
	const fullPath = global.id.elementSelect.value;
	console.log("Full Path:", fullPath);

	let currentStyle = "";

	if (isBlueprint) {
		const selector = getElementFromPath().timeStamp;
		console.log("Blueprint Selector:", selector);

		const currentMap = blueprintMap.get(selector);
		console.log("Current Blueprint Map:", JSON.stringify(currentMap, null, 2));

		const selectedBlueprintElement = global.id.blueprintSelect.value;
		const selectedBlueprintElementTrimmed = selectedBlueprintElement
			.replace(">", "")
			.trim();
		console.log("Selected Blueprint Element:", selectedBlueprintElementTrimmed);

		const targetElement = getTargetElement(
			currentMap,
			selectedBlueprintElementTrimmed,
		);
		console.log("Target Element:", targetElement);

		if (targetElement?.style && typeof targetElement.style === "string") {
			if (!isState) {
				currentStyle = targetElement.style;
			} else {
				for (const state of targetElement.extend) {
					console.log("Current State:", state);
					console.log("Selected State:", global.id.elementStateSelect.value);
					if (state.extension === global.id.elementBlueprintStateSelect.value) {
						console.log("Current State:", state);
						currentStyle = state.style;
						break;
					}
				}
			}
		}
	} else {
		if (global.id.navAdditionalScreen.classList.contains("screenDesktop")) {
			if (!isState) {
				currentStyle = cssMap?.get(fullPath) || "";
			} else {
				currentStyle = cssMap?.get(global.id.elementStateSelect.value) || "";
			}
		} else if (
			global.id.navAdditionalScreen.classList.contains("screenTablet")
		) {
			if (!isState) {
				currentStyle =
					mediaQueriesMap.get("max-width: 768px")?.get(fullPath) || "";
			} else {
				currentStyle =
					mediaQueriesMap
						.get("max-width: 768px")
						?.get(global.id.elementStateSelect.value) || "";
			}
		} else if (
			global.id.navAdditionalScreen.classList.contains("screenMobile")
		) {
			if (!isState) {
				currentStyle =
					mediaQueriesMap.get("max-width: 640px")?.get(fullPath) || "";
			} else {
				currentStyle =
					mediaQueriesMap
						.get("max-width: 640px")
						?.get(global.id.elementStateSelect.value) || "";
			}
		}
	}
	console.log("Current Style:", currentStyle);

	console.log("Applied Properties:", currentStyle);
	const appliedProperties = currentStyle
		.split(";")
		.filter(Boolean)
		.map((prop) => prop.split(":")[0].trim());
	console.log("Applied Properties:", appliedProperties);

	const propertySelectAll = global.id.propertySelectAll;
	const statePropertySelectAll = global.id.statePropertySelectAll;
	const blueprintPropertySelectAll = global.id.stateBlueprintPropertySelectAll;

	if (!isState && !isBlueprint) {
		propertySelectAll.innerHTML = "";
	} else if (isBlueprint) {
		blueprintPropertySelectAll.innerHTML = "";
	} else if (isState) {
		statePropertySelectAll.innerHTML = "";
	}

	for (const property of cssProperties) {
		if (!appliedProperties.includes(property)) {
			const option = document.createElement("option");
			option.value = property;
			option.textContent = property;
			if (!isState && !isBlueprint) {
				propertySelectAll.appendChild(option);
			} else if (isBlueprint) {
				blueprintPropertySelectAll.appendChild(option);
			} else if (isState) {
				statePropertySelectAll.appendChild(option);
			}
		}
	}
	console.log("Property Select All populated successfully");
}

function getTargetElement(currentMap, blueprintSelectValue) {
	const blueprintSelectValueTrimmed = blueprintSelectValue.replace(">", "");
	const blueprintSelectorsArray = blueprintSelectValueTrimmed.split(">");
	const searchedArray = [];

	for (const i in blueprintSelectorsArray) {
		const trimmedElement = blueprintSelectorsArray[i].trim();
		const counter = trimmedElement.match(/(?<=nth-of-type\()\d+/) ?? 1;
		if (Number(i) + 1 !== blueprintSelectorsArray.length)
			searchedArray.push(`children[${counter - 1}]`);
		else searchedArray.push(`[${counter - 1}]`);
	}

	let targetElement = currentMap;
	try {
		for (let j = 0; j < searchedArray.length - 1; j++) {
			const path = searchedArray[j];
			targetElement = targetElement.children
				? targetElement.children[Number.parseInt(path.match(/\d+/)[0])]
				: targetElement[Number.parseInt(path.match(/\d+/)[0])];
		}
	} catch (error) {
		console.error("Error navigating path:", error);
	}
	return targetElement;
}
