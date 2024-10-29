/**
 * @type {import('./_globals.js')}
 * @typedef {import('./types.js').JsonObject} JsonObject
 */
import updateElementInfo from "./updateElementInfo.js";
import populatePropertySelectAll from "./populatePropertySelectAll.js";
import applyStyles from "./applyStyles.js";
import updatePropertySelectOptions from "./updatePropertySelectOptions.js";
import validateRemoveElement from "./validateRemoveElement.js";
import removeStyle from "./removeStyle.js";
import rebuildCssSelector from "./rebuildCssSelector.js";
import populateSelectOptions from "./populateSelectOptions.js";
import populateElementStateOptions from "./populateElementStateOptions.js";
import populateStateSelectAllOptions from "./populateStateSelectAllOptions.js";
import validateParentElement from "./validateParentElement.js";
import populateElementSelectAll from "./populateElementSelectAll.js";
import populateAttributeOptionsValue from "./populateAttributeOptionsValue.js";
import resolveToggleContext from "./resolveToggleContext.js";
import initialLoader from "./initialLoader.js";
import creatorSave from "./creatorSave.js";
import {
	loadHeadView,
	loadFontsView,
	loadRootView,
	loadBodyView,
	loadMenuLevelView,
	loadRoutesView,
	loadSettingsView,
	loadThemesView,
	centralBarCleanup,
} from "./loadView.js";
import populateAttributeSelectAll from "./populateAttributeSelectAll.js";
import populatePropertyValue from "./populatePropertyValue.js";
import populateAttributeOptions from "./populateAttributeOptions.js";
import serializeElement from "./serializeElement.js";
import populateTreeView from "./populateTreeView.js";
import highlightSelectedElement from "./highlightSelectedElement.js";
import getElementFromPath from "./getElementFromPath.js";
import resolveElementStateSelect from "./resolveElementStateSelect.js";
import populateRoutesView from "./populateRoutesView.js";
import { onLoadPopulateFontsCreator } from "./loadFont.js";
import eventListenerClickElement from "./eventListenerClickElement.js";
import { onLoadPopulateRootCreator } from "./loadRoot.js";
import populateThemeOptions from "./populateThemeOptions.js";
import loadTheme from "./loadTheme.js";
import resolveInitialSettings from "./resolveInitialSettings.js";
import resolveNavSelectPreview from "./resolveNavSelectPreview.js";
import createInitialSettings from "./createInitialSettings.js";
import removeAttribute from "./removeAttribute.js";
import populateClassroomSelectName from "./populateClassroomSelectName.js";
import populateClassroomSelectType from "./populateClassroomSelectType.js";
import createElementFromJson from "./createElementFromJson.js";
import replaceBlueprintJsonPlaceholders from "./replaceBlueprintJsonPlaceholders.js";
import getElementPath from "./getElementPath.js";
import populateSelectBlueprintOptions from "./populateSelectBlueprintOptions.js";
import reloadBlueprint from "./reloadBlueprint.js";

/**
 * Sets up the event handlers.
 * @param {Array} cssProperties - The array containing CSS properties.
 */
export const eventHandlers = () => {
	const cssProperties = getCssProperties();

	function getCssProperties() {
		// Create a dummy element to access the full list of possible CSS properties
		const dummyElement = document.createElement("div");

		// Access the style object, which contains all possible CSS properties
		const allCSSProperties = dummyElement.style;

		// Log all the CSS properties
		const cssProperties = [];
		for (const property in allCSSProperties) {
			if (Object.prototype.hasOwnProperty.call(allCSSProperties, property)) {
				// Convert camelCase to kebab-case
				const kebabCaseProperty = camelCaseToKebabCase(property);
				cssProperties.push(kebabCaseProperty);
			}
		}
		return cssProperties;
	}

	function camelCaseToKebabCase(camelCase) {
		return camelCase.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
	}
	const headMap = global.map.headMap;
	const rootMap = global.map.rootMap;
	const fontMap = global.map.fontMap;
	const classroomMap = global.map.classroomMap;
	const stageMap = global.map.stageMap;
	const cssMap = global.map.cssMap;
	const mediaQueriesMap = global.map.mediaQueriesMap;

	global.id.navHead.addEventListener("click", () => {
		loadHeadView();
	});
	global.id.navBody.addEventListener("click", () => {
		loadBodyView();
	});
	global.id.navFonts.addEventListener("click", () => {
		loadFontsView();
	});
	global.id.navRoot.addEventListener("click", () => {
		loadRootView();
	});

	global.id.navAdditionalScreen.addEventListener("click", () => {
		if (global.id.navDevice.style.display === "flex") {
			global.id.navDevice.style.display = "none";
		} else {
			global.id.navDevice.style.display = "flex";
			global.id.navPreview.style.display = "none";
		}
	});

	global.id.navSelectPreview.addEventListener("click", () => {
		if (global.id.navPreview.style.display === "flex") {
			global.id.navPreview.style.display = "none";
		} else {
			global.id.navPreview.style.display = "flex";
			global.id.navDevice.style.display = "none";
		}
	});

	// function tempUpdateFunction() {
	// 	const element = getElementFromPath();
	// 	console
	// 	updateElementInfo(global.id.elementSelect.value, element);
	// }

	global.id.navScreenDesktop.addEventListener("click", () => {
		global.id.navAdditionalScreen.classList.remove(
			"screenDesktop",
			"screenTablet",
			"screenMobile",
		);
		global.id.navAdditionalScreen.classList.add("screenDesktop");
		const preview = global.id.preview;
		preview.style.width = "100%";
		loadBodyView();
		// tempUpdateFunction();
	});
	global.id.navScreenTablet.addEventListener("click", () => {
		global.id.navAdditionalScreen.classList.remove(
			"screenDesktop",
			"screenTablet",
			"screenMobile",
		);
		global.id.navAdditionalScreen.classList.add("screenTablet");
		const preview = global.id.preview;
		preview.style.width = "768px";
		loadBodyView();
		// tempUpdateFunction();
	});
	global.id.navScreenMobile.addEventListener("click", () => {
		global.id.navAdditionalScreen.classList.remove(
			"screenDesktop",
			"screenTablet",
			"screenMobile",
		);
		global.id.navAdditionalScreen.classList.add("screenMobile");
		const preview = global.id.preview;
		preview.style.width = "375px";
		loadBodyView();
		// tempUpdateFunction();
	});
	global.id.navPreviewNormal.addEventListener("click", () => {
		global.id.navSelectPreview.classList.remove("preview", "static", "tree");
		global.id.navSelectPreview.classList.add("preview");
		global.id.preview.style.display = "flex";
		global.id.previewTree.style.display = "none";
		global.id.navAdditionalScreen.style.display = "flex";
		// global.id.mainInitialSelector.style.display = "flex";
		global.id.selectedElementHighlight.style.display = "flex";
		resolveNavSelectPreview();
	});
	global.id.navPreviewStatic.addEventListener("click", () => {
		global.id.navSelectPreview.classList.remove("preview", "tree");
		global.id.navSelectPreview.classList.add("static");
		global.id.preview.style.display = "flex";
		global.id.previewTree.style.display = "none";
		global.id.navAdditionalScreen.style.display = "flex";
		// global.id.mainInitialSelector.style.display = "flex";
		global.id.selectedElementHighlight.style.display = "flex";
		resolveNavSelectPreview();
	});
	global.id.navPreviewTree.addEventListener("click", () => {
		global.id.navSelectPreview.classList.remove("preview", "static", "tree");
		global.id.navSelectPreview.classList.add("tree");
		global.id.preview.style.display = "none";
		global.id.previewTree.style.display = "flex";
		global.id.navAdditionalScreen.style.display = "none";
		// global.id.mainInitialSelector.style.display = "none";
		global.id.selectedElementHighlight.style.display = "none";
		populateTreeView();
		highlightSelectedElement();
		resolveNavSelectPreview(); //TODO: estimate is it needed
	});

	global.id.navDevice.addEventListener("mouseleave", () => {
		global.id.navDevice.style.display = "none";
	});
	global.id.navPreview.addEventListener("mouseleave", () => {
		global.id.navPreview.style.display = "none";
	});

	//document element id onlyLogo on mouse enter display none
	global.id.leftSidebarCanvas.addEventListener("mouseenter", () => {
		global.id.leftSidebarCanvas.style.transform = "translateX(0)";
		global.id.leftSidebarCanvas.style.transition = "transform 0.5s";
	});

	global.id.leftSidebarCanvas.addEventListener("mouseleave", () => {
		global.id.navDevice.style.display = "none";
		global.id.navPreview.style.display = "none";

		if (global.id.leftSide.classList.contains(global.class.right)) {
			global.id.leftSidebarCanvas.style.transform = "translateX(85%)";
		} else global.id.leftSidebarCanvas.style.transform = "translateX(-85%)";
	});

	global.id.leftSidebarSwitchSide.addEventListener("click", () => {
		global.id.leftSide.classList.toggle(global.class.right);
		global.id.leftSidebar.style.transition = "none";
	});

	global.id.elementSelect.addEventListener("change", () => {
		const selectedValue = global.id.elementSelect.value;
		const element = getElementFromPath();
		updateElementInfo(selectedValue, element);
		populatePropertySelectAll(cssProperties);
		highlightSelectedElement();
	});

	global.id.selectedElementHighlight.addEventListener("mousedown", () => {
		const nameHelper = global.id.nameHelper;
		const element = getElementFromPath();
		if (element) {
			const selectionColor = {
				red: "rgba(255, 0, 0, 1)",
				green: "rgba(0, 255, 0, 1)",
				blue: "rgba(0, 0, 255, 1)",
			};
			const selected = global.localSettings.selectionColor;
			element.style.boxShadow = `0 0 10px ${selectionColor[selected]} inset, 0 0 10px ${selectionColor[selected]}`;
			const removeGlow = () => {
				element.style.boxShadow = "";
				document.removeEventListener("mouseup", removeGlow);
			};
			document.addEventListener("mouseup", removeGlow);
		}
		nameHelper.style.display = "flex";
	});

	const handleEventStopGlowing = (path) => {
		const nameHelper = global.id.nameHelper;
		const element = getElementFromPath(path);
		if (element) {
			element.classList.remove("cwrap-glowing");
		}
		nameHelper.style.display = "none";
	};

	global.id.selectedElementHighlight.addEventListener("mouseleave", () =>
		handleEventStopGlowing(),
	);
	global.id.selectedElementHighlight.addEventListener("mouseup", () =>
		handleEventStopGlowing(),
	);

	global.id.selectContextHighlight.addEventListener("mousedown", () => {
		const element = getElementFromPath(
			`${global.id.elementSelect.value} > ${global.id.selectContext.value}`,
		);
		console.log("element", element);

		if (element) {
			const selectionColor = {
				red: "rgba(255, 0, 0, 1)",
				green: "rgba(0, 255, 0, 1)",
				blue: "rgba(0, 0, 255, 1)",
			};
			const selected = global.localSettings.selectionColor;
			element.style.boxShadow = `0 0 10px ${selectionColor[selected]} inset, 0 0 10px ${selectionColor[selected]}`;
			const removeGlow = () => {
				element.style.boxShadow = "";
				document.removeEventListener("mouseup", removeGlow);
			};
			document.addEventListener("mouseup", removeGlow);
		}
	});

	global.id.selectContextHighlight.addEventListener("mouseleave", () => {
		const element = getElementFromPath(
			`${global.id.elementSelect.value} > ${global.id.selectContext.value}`,
		);
		if (element) {
			element.style.boxShadow = "";
		}
	});

	global.id.selectContextHighlight.addEventListener("mouseup", () => {
		const element = getElementFromPath(
			`${global.id.elementSelect.value} > ${global.id.selectContext.value}`,
		);
		if (element) {
			element.style.boxShadow = "";
		}
	});

	function transformStateTitleToPath(title) {
		let transformedTitle = title.replace(/:has\(/g, " > ");
		transformedTitle = transformedTitle.replace(/:\w+\)/g, "");
		return transformedTitle;
	}
	global.id.stateContextInfo.addEventListener("mousedown", () => {
		console.log(
			"stateContextInfo mousedown event",
			global.id.stateContextInfo.title,
		);
		const element = getElementFromPath(
			transformStateTitleToPath(global.id.elementStateSelect.value),
		);
		console.log("element", element);
		if (element) {
			const selectionColor = {
				red: "rgba(255, 0, 0, 1)",
				green: "rgba(0, 255, 0, 1)",
				blue: "rgba(0, 0, 255, 1)",
			};
			const selected = global.localSettings.selectionColor;
			element.style.boxShadow = `0 0 10px ${selectionColor[selected]} inset, 0 0 10px ${selectionColor[selected]}`;
			const removeGlow = () => {
				element.style.boxShadow = "";
				document.removeEventListener("mouseup", removeGlow);
			};
			document.addEventListener("mouseup", removeGlow);
		}
	});

	global.id.stateContextInfo.addEventListener("mouseleave", () => {
		const element = getElementFromPath(
			transformStateTitleToPath(global.id.elementStateSelect.value),
		);
		if (element) {
			element.style.boxShadow = "";
		}
	});

	global.id.stateContextInfo.addEventListener("mouseup", () => {
		const element = getElementFromPath(
			transformStateTitleToPath(global.id.elementStateSelect.value),
		);
		if (element) {
			element.style.boxShadow = "";
		}
	});

	global.id.selectedElementLabelContainerSwitchSide.addEventListener(
		"click",
		() => {
			global.id.selectedElementLabelContainer.classList.toggle("bottom");
		},
	);

	global.id.propertySelect.addEventListener("change", () => {
		console.log("propertySelect change event"); // debugging
		const element = getElementFromPath();
		updateElementInfo(global.id.elementSelect.value, element);
		populatePropertyValue(undefined, false);
	});

	global.id.statePropertySelect.addEventListener("change", () => {
		console.log("statePropertySelect change event"); // debugging
		const element = getElementFromPath();
		updateElementInfo(global.id.elementSelect.value, element);
		populatePropertyValue(undefined, true);
	});

	global.id.stateSelectAll.addEventListener("change", () => {
		populateStateSelectAllOptions();
		// resolveToggleContext();
	});

	/**
	 * Event handler for the save button.
	 * When the button is clicked, the data from the iframe is saved to skeletonBody.json.
	 */
	global.id.menuSave.addEventListener("click", () => {
		creatorSave();
		console.log("Save clicked"); //debugging
		// console.log(global.map.extendMap); //debugging // commented out to confirm extendedMap is not used
		// for (const [key, _] of cssMap) {
		// 	if (key.includes(":has")) {
		// 		const newKey = key.split(":has")[0];
		// 		const newValue = `:has${key.split(":has")[1]}`;
		// 		extendMap.set(newKey, newValue);
		// 	} else if (key.includes(":hover")) {
		// 		const newKey = key.split(":hover")[0];
		// 		const newValue = `:hover${key.split(":hover")[1]}`;
		// 		extendMap.set(newKey, newValue);
		// 	}
		// }
		// console.log(global.map.extendMap); //debugging

		/**
		 * @type {JsonObject} bodyJson
		 */
		let bodyJson = serializeElement(global.id.doc.body);
		// let bodyJsonTemp = serializeElement(global.id.doc.body, true);

		function encapsulateJson(jsonObj) {
			let newJsonObj = JSON.parse(JSON.stringify(jsonObj));
			if (stageMap.size > 0) {
				const stage = {};
				for (const [key, value] of stageMap.entries()) {
					stage[key] = value;
				}
				newJsonObj = { ...newJsonObj, stage };
			}

			if (classroomMap.size > 0) {
				const classroom = [];
				for (const [key, value] of classroomMap.entries()) {
					classroom.push(value);
				}
				newJsonObj = { classroom, ...newJsonObj };
			}

			if (rootMap.size > 0) {
				const root = {};
				for (const [key, value] of rootMap.entries()) {
					root[key] = value;
				}
				newJsonObj = { root, ...newJsonObj };
			}

			if (fontMap.size > 0) {
				let fonts = {};
				for (const [key, value] of fontMap.entries()) {
					fonts[key] = value;
				}
				fonts = fonts.fonts;
				newJsonObj = { fonts, ...newJsonObj };
			}

			if (headMap.size > 0) {
				const head = {};
				for (const [key, value] of headMap.entries()) {
					head[key] = value;
				}
				newJsonObj = { head, ...newJsonObj };
			}
			return newJsonObj;
		}
		bodyJson = encapsulateJson(bodyJson);
		// bodyJsonTemp = encapsulateJson(bodyJsonTemp);

		fetch(`/save-skeleton${window.location.pathname}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(bodyJson),
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.success) {
					console.log("skeletonBody.json saved successfully!");
				} else {
					console.error("Error saving skeletonBody.json:", data.error);
				}
			})
			.catch((error) => {
				console.error("Error saving skeletonBody.json:", error);
			});
		// fetch(`/save-skeleton-temp${window.location.pathname}`, {
		// 	method: "POST",
		// 	headers: {
		// 		"Content-Type": "application/json",
		// 	},
		// 	body: JSON.stringify(bodyJsonTemp),
		// })
		// 	.then((response) => response.json())
		// 	.then((data) => {
		// 		if (data.success) {
		// 			console.log("skeletonBody.json saved successfully to dist!");
		// 		} else {
		// 			console.error("Error saving skeletonBody.json:", data.error);
		// 		}
		// 	})
		// 	.catch((error) => {
		// 		console.error("Error saving skeletonBody.json:", error);
		// 	});
	});

	/**
	 * Event handler for the reload button.
	 * When the button is clicked, the data from skeletonBody.json is loaded into the iframe.
	 */
	global.id.menuReload.addEventListener("click", () => {
		// initialLoader();
		const wizardTitle = global.id.wizardTitle.textContent.split(" ")[0];
		let param = "";
		if (wizardTitle === "Head") {
			param = "?param=head";
		} else if (wizardTitle === "Fonts") {
			param = "?param=fonts";
		} else if (wizardTitle === "Root") {
			param = "?param=root";
		}
		window.location.href = `${window.location.pathname}${param}`;
	});

	global.id.editStyle.addEventListener("click", () => {
		global.variable.memoryElement = global.id.elementSelect.value;
		global.id.mainInitialSelector.style.display = "none";
		global.id.mainStyleSelector.style.display = "flex";
		global.id.mainStyleSelector2.style.display = "flex";
		populatePropertyValue();
	});

	global.id.openAddProperty.addEventListener("click", () => {
		global.id.mainStyleSelector.style.display = "none";
		global.id.mainStyleSelector2.style.display = "none";
		global.id.mainStyleAdd.style.display = "flex";
		populatePropertySelectAll(cssProperties);
	});

	global.id.openAddAttribute.addEventListener("click", () => {
		global.id.mainAttributeSelector.style.display = "none";
		global.id.mainAttributeSelector2.style.display = "none";
		global.id.mainAttributeAdd.style.display = "flex";
		populateAttributeSelectAll();
	});

	global.id.attributeSelect.addEventListener("change", () => {
		console.log("attributeSelect change event"); // debugging
		//here function that add attribute
		populateAttributeOptionsValue();
	});

	global.id.addAttribute.addEventListener("click", () => {
		const attributeSelect = global.id.attributeSelect;
		const attributeSelectAll = global.id.attributeSelectAll;
		const selectedAttribute = attributeSelectAll.value;
		const element = getElementFromPath();
		if (element) {
			element.setAttribute(selectedAttribute, "");
			const newOption = new Option(selectedAttribute, selectedAttribute);
			attributeSelect.appendChild(newOption);
			attributeSelect.value = selectedAttribute;
		}
		populateAttributeOptionsValue();
		backToMainAttributeSelector();
	});

	global.id.removeAttribute.addEventListener("click", () => {
		removeAttribute();
		populateAttributeOptionsValue();
	});

	function backToMainStyleSelector() {
		global.id.mainStyleSelector.style.display = "flex";
		global.id.mainStyleSelector2.style.display = "flex";
		global.id.mainStyleAdd.style.display = "none";
	}

	function backToMainAttributeSelector() {
		global.id.mainAttributeSelector.style.display = "flex";
		global.id.mainAttributeSelector2.style.display = "flex";
		global.id.mainAttributeAdd.style.display = "none";
	}

	global.id.mainStyleAddBack.addEventListener("click", () => {
		backToMainStyleSelector();
	});

	global.id.addStateProperty.addEventListener("click", () => {
		const statePropertySelectAll = global.id.statePropertySelectAll;
		const fullPath = global.id.elementStateSelect.value;
		const selectedProperty = statePropertySelectAll.value;
		const newValue = "";
		const currentStyle = cssMap.get(fullPath) || "";
		const styleProperties = currentStyle
			.split(";")
			.map((prop) => prop.trim())
			.filter(Boolean);
		// Check if the property already exists
		const propertyExists = styleProperties.some(
			(prop) => prop === selectedProperty,
		);
		// If the property exists, update it; otherwise, add it
		const newStyle = propertyExists
			? styleProperties
					.map((prop) => {
						const [key] = prop.split(":").map((item) => item.trim());
						return key === selectedProperty ? `${key}: ${newValue}` : prop;
					})
					.join("; ")
			: [...styleProperties, `${selectedProperty}: ${newValue}`]
					.join("; ")
					.concat(";");
		cssMap.set(fullPath, newStyle);
		applyStyles();
		global.variable.style = newStyle;
		updatePropertySelectOptions(true);
		global.id.statePropertySelect.value = selectedProperty;
		global.id.statePropertyInput.value = ""; // Clear the input field for now
		// global.id.mainStateStyleSelector2.style.display = "flex";
		console.log("Add state property clicked"); // debugging

		global.id.mainStateStyleSelector.style.display = "flex";
		global.id.mainStateStyleSelector2.style.display = "flex";

		global.id.mainStateStyleAdd.style.display = "none";
	});

	global.id.mainStateStyleAddBack.addEventListener("click", () => {
		global.id.mainStateStyleSelector.style.display = "flex";
		global.id.mainStateStyleSelector2.style.display = "flex";
		global.id.mainStateStyleAdd.style.display = "none";
		// populatePropertyValue(global.variable.memoryElement);
	});

	//TODO This function need refactor badly
	global.id.addProperty.addEventListener("click", () => {
		const propertySelectAll = global.id.propertySelectAll;
		const fullPath = global.id.elementSelect.value;
		const selectedProperty = propertySelectAll.value;
		const newValue = "";
		let currentStyle;
		if (global.id.navAdditionalScreen.classList.contains("screenDesktop")) {
			currentStyle = cssMap.get(fullPath) || "";
		} else if (
			global.id.navAdditionalScreen.classList.contains("screenTablet")
		) {
			currentStyle =
				mediaQueriesMap.get("max-width: 768px")?.get(fullPath) || "";
		} else if (
			global.id.navAdditionalScreen.classList.contains("screenMobile")
		) {
			currentStyle =
				mediaQueriesMap.get("max-width: 640px")?.get(fullPath) || "";
		}
		const styleProperties = currentStyle
			.split(";")
			.map((prop) => prop.trim())
			.filter(Boolean);
		// Check if the property already exists
		const propertyExists = styleProperties.some(
			(prop) => prop === selectedProperty,
		);
		// If the property exists, update it; otherwise, add it
		const newStyle = propertyExists
			? styleProperties
					.map((prop) => {
						const [key] = prop.split(":").map((item) => item.trim());
						return key === selectedProperty ? `${key}: ${newValue}` : prop;
					})
					.join("; ")
			: [...styleProperties, `${selectedProperty}: ${newValue}`]
					.join("; ")
					.concat(";");
		if (global.id.navAdditionalScreen.classList.contains("screenDesktop")) {
			cssMap.set(fullPath, newStyle);
		} else if (
			global.id.navAdditionalScreen.classList.contains("screenTablet")
		) {
			const mediaQueries = mediaQueriesMap.get("max-width: 768px");
			mediaQueries.set(fullPath, newStyle);
		} else if (
			global.id.navAdditionalScreen.classList.contains("screenMobile")
		) {
			const mediaQueries = mediaQueriesMap.get("max-width: 640px");
			mediaQueries.set(fullPath, newStyle);
		}
		applyStyles();
		global.variable.style = newStyle;
		updatePropertySelectOptions(false);
		global.id.propertySelect.value = selectedProperty;
		global.id.propertyInput.value = ""; // Clear the input field for now
		console.log("Add property clicked"); // debugging
		backToMainStyleSelector();
	});

	global.id.mainAttributeAddBack.addEventListener("click", () => {
		backToMainAttributeSelector();
	});

	global.id.editText.addEventListener("click", () => {
		global.id.mainInitialSelector.style.display = "none";
		global.id.mainTextEditor.style.display = "flex";
		global.id.mainTextEditor2.style.display = "flex";
		global.id.mainTextEditor2.value = "";
		if (global.id.elementSelect.value !== "none") {
			/**
			 * @type {Element}
			 */
			const element = getElementFromPath();
			// Get only the text content of the element itself, excluding its children
			const textContent = Array.from(element.childNodes)
				.filter((node) => node.nodeType === Node.TEXT_NODE)
				.map((node) => node.nodeValue.trim())
				.join(" ");

			global.id.mainTextEditor2.value = textContent;
		}
	});

	global.id.mainTextEditorBack.addEventListener("click", () => {
		global.id.mainInitialSelector.style.display = "flex";
		global.id.mainTextEditor.style.display = "none";
		global.id.mainTextEditor2.style.display = "none";
	});

	global.id.updateText.addEventListener("click", () => {
		const element = getElementFromPath();
		element.textContent = global.id.mainTextEditor2.value;
	});

	global.id.editAttributes.addEventListener("click", () => {
		global.id.mainInitialSelector.style.display = "none";
		global.id.mainAttributeSelector.style.display = "flex";
		global.id.mainAttributeSelector2.style.display = "flex";
		populateAttributeOptions();
		populateAttributeOptionsValue();
	});

	global.id.mainBlueprintAttributeSelectorBack.addEventListener("click", () => {
		global.id.mainBlueprintSelector.style.display = "flex";
		global.id.mainBlueprintAttributeSelector.style.display = "none";
		global.id.mainBlueprintAttributeSelector2.style.display = "none";
	});

	global.id.mainBlueprintTextEditorBack.addEventListener("click", () => {
		global.id.mainBlueprintSelector.style.display = "flex";
		global.id.mainBlueprintTextEditor.style.display = "none";
		global.id.mainBlueprintTextEditor2.style.display = "none";
	});

	global.id.mainBlueprintSelectorEditText.addEventListener("click", () => {
		global.id.mainBlueprintSelector.style.display = "none";
		global.id.mainBlueprintTextEditor.style.display = "flex";
		global.id.mainBlueprintTextEditor2.style.display = "flex";

		if (global.id.blueprintSelect.value) {
			const blueprintMap = global.map.blueprintMap;
			const currentElement = getElementFromPath();
			const selector = currentElement.timeStamp;
			const currentMap = blueprintMap.get(selector);
			const selectedBlueprintElement = global.id.blueprintSelect.value;
			const selectedBlueprintElementTrimmed = selectedBlueprintElement
				.replace(">", "")
				.trim();
			const textArray = [];

			function extractTextFromMap(
				map,
				parentKey = "",
				siblingCountMap = new Map(),
			) {
				for (const key in map) {
					if (key === "element") {
						const currentKey = parentKey
							? `${parentKey} > ${map[key]}`
							: map[key];
					}
					if (key === "children" && Array.isArray(map[key])) {
						if (!siblingCountMap.has(parentKey)) {
							siblingCountMap.set(parentKey, new Map());
						}
						const parentSiblingCount = siblingCountMap.get(parentKey);

						for (const child of map[key]) {
							const childElement = child.element;
							if (!parentSiblingCount.has(childElement)) {
								parentSiblingCount.set(childElement, 0);
							}
							parentSiblingCount.set(
								childElement,
								parentSiblingCount.get(childElement) + 1,
							);
							const nthOfType = parentSiblingCount.get(childElement);
							const childKey = parentKey
								? `${parentKey} > ${childElement}:nth-of-type(${nthOfType})`
								: `${map.element} > ${childElement}:nth-of-type(${nthOfType})`;
							textArray.push({ element: childKey, text: child.text || "" });
							extractTextFromMap(child, childKey, siblingCountMap);
						}
					}
				}
			}

			if (currentMap?.element) {
				textArray.push({
					element: currentMap.element,
					text: currentMap.text || "",
				});
			}

			extractTextFromMap(currentMap);
			const textValue = textArray.find(
				(item) => item.element === selectedBlueprintElementTrimmed,
			)?.text;
			global.id.mainBlueprintTextEditor2.value = textValue || "";
		}
	});

	function populateBlueprintAttributeOptions(targetElement) {
		const blueprintAttributeSelect = global.id.blueprintAttributeSelect;
		blueprintAttributeSelect.innerHTML = "";
		if (targetElement?.attributes) {
			for (const attribute in targetElement.attributes) {
				const newOption = new Option(attribute, attribute);
				blueprintAttributeSelect.appendChild(newOption);
			}
		}
	}

	function populateBlueprintAttributeOptionsValue(targetElement) {
		const blueprintAttributeSelectValue =
			global.id.blueprintAttributeSelect.value;
		const attributeValue = blueprintAttributeSelectValue
			? targetElement.attributes[blueprintAttributeSelectValue]
			: "";
		global.id.blueprintAttributeInput.value = attributeValue || "";
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

	global.id.mainBlueprintSelectorAttributes.addEventListener("click", () => {
		global.id.mainBlueprintSelector.style.display = "none";
		global.id.mainBlueprintAttributeSelector.style.display = "flex";
		global.id.mainBlueprintAttributeSelector2.style.display = "flex";
		const blueprintMap = global.map.blueprintMap;
		const selector = getElementFromPath().timeStamp;
		const currentMap = blueprintMap.get(selector);
		const blueprintSelectValue = global.id.blueprintSelect.value;

		const targetElement = getTargetElement(currentMap, blueprintSelectValue);
		// console.log("Final Target Element:", targetElement);

		populateBlueprintAttributeOptions(targetElement);
		populateBlueprintAttributeOptionsValue(targetElement);
	});

	global.id.blueprintAttributeSelect.addEventListener("change", () => {
		console.log("blueprintAttributeSelect change event"); // debugging
		const blueprintMap = global.map.blueprintMap;
		const selector = getElementFromPath().timeStamp;
		const currentMap = blueprintMap.get(selector);
		const blueprintSelectValue = global.id.blueprintSelect.value;

		const targetElement = getTargetElement(currentMap, blueprintSelectValue);
		populateBlueprintAttributeOptionsValue(targetElement);
	});

	global.id.updateBlueprintAttribute.addEventListener("click", () => {
		const blueprintMap = global.map.blueprintMap;
		const selector = getElementFromPath().timeStamp;
		const currentMap = blueprintMap.get(selector);
		const blueprintSelectValue = global.id.blueprintSelect.value;

		const targetElement = getTargetElement(currentMap, blueprintSelectValue);

		const blueprintAttributeSelect = global.id.blueprintAttributeSelect;
		const blueprintAttributeSelectValue = blueprintAttributeSelect.value;
		const blueprintAttributeInput = global.id.blueprintAttributeInput;
		const attributeValue = blueprintAttributeInput.value;
		if (targetElement) {
			targetElement.attributes[blueprintAttributeSelectValue] = attributeValue;
		}
		populateBlueprintAttributeOptionsValue(targetElement);
		reloadBlueprint();
	});

	global.id.mainStyleSelectorBack.addEventListener("click", () => {
		global.id.mainInitialSelector.style.display = "flex";
		global.id.mainStyleSelector.style.display = "none";
		global.id.mainStyleSelector2.style.display = "none";
	});

	global.id.mainAttributeSelectorBack.addEventListener("click", () => {
		global.id.mainInitialSelector.style.display = "flex";
		global.id.mainAttributeSelector.style.display = "none";
		global.id.mainAttributeSelector2.style.display = "none";
	});

	global.id.blueprintRemoveAttribute.addEventListener("click", () => {
		const blueprintMap = global.map.blueprintMap;
		const selector = getElementFromPath().timeStamp;
		const currentMap = blueprintMap.get(selector);
		const blueprintSelectValue = global.id.blueprintSelect.value;

		const targetElement = getTargetElement(currentMap, blueprintSelectValue);

		const blueprintAttributeSelect = global.id.blueprintAttributeSelect;
		const blueprintAttributeSelectValue = blueprintAttributeSelect.value;

		if (targetElement.attributes) {
			delete targetElement.attributes[blueprintAttributeSelectValue];
			console.log("Removed attribute:", blueprintAttributeSelectValue);
		}

		populateBlueprintAttributeOptions(targetElement);
		populateBlueprintAttributeOptionsValue(targetElement);
		reloadBlueprint();
	});

	global.id.openBlueprintAddAttribute.addEventListener("click", () => {
		// global.id.mainBlueprintSelector.style.display = "none";
		global.id.mainBlueprintAttributeSelector.style.display = "none";
		global.id.mainBlueprintAttributeSelector2.style.display = "none";
		global.id.mainBlueprintAttributeAdd.style.display = "flex";
		populateAttributeSelectAll(true);
	});

	global.id.mainBlueprintAttributeAddBack.addEventListener("click", () => {
		// global.id.mainBlueprintSelector.style.display = "flex";
		global.id.mainBlueprintAttributeSelector.style.display = "flex";
		global.id.mainBlueprintAttributeSelector2.style.display = "flex";
		global.id.mainBlueprintAttributeAdd.style.display = "none";
	});

	global.id.blueprintAddAttribute.addEventListener("click", () => {
		const blueprintMap = global.map.blueprintMap;
		const selector = getElementFromPath().timeStamp;
		console.log("Selector:", selector);
		const currentMap = blueprintMap.get(selector);
		console.log("Current Map:", currentMap);
		const blueprintSelectValue = global.id.blueprintSelect.value;
		console.log("Blueprint Select Value:", blueprintSelectValue);

		const targetElement = getTargetElement(currentMap, blueprintSelectValue);
		console.log("Target Element:", targetElement);

		const blueprintAttributeSelectAll = global.id.blueprintAttributeSelectAll;
		const selectedAttribute = blueprintAttributeSelectAll.value;
		console.log("Selected Attribute:", selectedAttribute);
		const attributeValue = "";
		if (targetElement) {
			if (!targetElement.attributes) {
				targetElement.attributes = {};
			}
			targetElement.attributes[selectedAttribute] = attributeValue;
			console.log(
				"Updated Target Element Attributes:",
				targetElement.attributes,
			);
		} else {
			console.error("Target element is undefined");
		}
		populateBlueprintAttributeOptions(targetElement);
		global.id.blueprintAttributeInput.value = "";
		console.log("Blueprint Attribute Input cleared");

		// Manually add steps to go back to the main blueprint attribute selector
		global.id.mainBlueprintAttributeSelector.style.display = "flex";
		global.id.mainBlueprintAttributeSelector2.style.display = "flex";
		global.id.mainBlueprintAttributeAdd.style.display = "none";
		console.log("Navigated back to main blueprint attribute selector");
		reloadBlueprint();
		console.log("Blueprint reloaded");
	});

	global.id.mainBlueprintSelectorEditStyle.addEventListener("click", () => {
		global.id.mainBlueprintSelector.style.display = "none";
		global.id.mainBlueprintStyleSelector.style.display = "flex";
		global.id.mainBlueprintStyleSelector2.style.display = "flex";

		function populateBlueprintStyleOptions() {
			const blueprintStyleSelect = global.id.blueprintPropertySelect;
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

					if (
						currentElement.children &&
						Array.isArray(currentElement.children)
					) {
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

		populateBlueprintStyleOptions();
		populateBlueprintStyleOptionsValue();
	});

	function populateBlueprintStyleOptionsValue() {
		const blueprintStyleSelectValue = global.id.blueprintPropertySelect.value;
		const blueprintStyleInput = global.id.propertyBlueprintInput;
		blueprintStyleInput.value = "";
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

		if (targetElement?.style && typeof targetElement.style === "string") {
			const styles = targetElement.style.split(";");
			for (const style of styles) {
				const [property, value] = style.split(":");
				if (property.trim() === blueprintStyleSelectValue.trim()) {
					blueprintStyleInput.value = value.trim();
					break;
				}
			}
		}
	}

	global.id.blueprintPropertySelect.addEventListener("change", () => {
		populateBlueprintStyleOptionsValue();
	});

	global.id.mainBlueprintStyleSelectorBack.addEventListener("click", () => {
		global.id.mainBlueprintSelector.style.display = "flex";
		global.id.mainBlueprintStyleSelector.style.display = "none";
		global.id.mainBlueprintStyleSelector2.style.display = "none";
	});

	global.id.updateBlueprintProperty.addEventListener("click", () => {
		const blueprintMap = global.map.blueprintMap;
		const selector = getElementFromPath().timeStamp;
		const currentMap = blueprintMap.get(selector);
		const blueprintSelectValue = global.id.blueprintSelect.value;
	
		const targetElement = getTargetElement(currentMap, blueprintSelectValue);
	
		const blueprintPropertySelect = global.id.blueprintPropertySelect;
		const blueprintPropertySelectValue = blueprintPropertySelect.value;
		const blueprintPropertyInput = global.id.propertyBlueprintInput;
		const propertyValue = blueprintPropertyInput.value;
	
		if (targetElement) {
			const styles = targetElement.style.split(";");
			const updatedStyles = styles
				.map((style) => {
					const [property] = style.split(":");
					if (property.trim() === blueprintPropertySelectValue.trim()) {
						return `${property.trim()}: ${propertyValue.trim()}`;
					}
					return style;
				})
				.join(";");
			targetElement.style = updatedStyles;
	
			// Apply the style changes to the view
			const validSelector = blueprintSelectValue.replace(/ > /g, " ").replace(/:nth-of-type\(\d+\)/g, "");
			const elementInView = document.querySelector(validSelector);
			if (elementInView) {
				elementInView.style[blueprintPropertySelectValue.trim()] = propertyValue.trim();
			}
	
			// Rebuild the blueprint element
			reloadBlueprint();
			const selectedValue = global.id.elementSelect.value;
			const firstChildrenTag =
				getElementFromPath(selectedValue).childNodes[0].tagName.toLowerCase();
			removeStyle(`${selectedValue} > ${firstChildrenTag}`);
			rebuildStyleFromBlueprint();
			applyStyles();
		}
	
		populateBlueprintStyleOptionsValue();
	});

	global.id.openState.addEventListener("click", () => {
		global.id.mainStyleSelector.style.display = "none";
		global.id.mainStyleSelector2.style.display = "none";
		global.id.mainStateSelector.style.display = "flex";
		populateElementStateOptions();
		resolveElementStateSelect();
	});

	global.id.editStateStyle.addEventListener("click", () => {
		global.id.mainStateSelector.style.display = "none";
		global.id.mainStateStyleSelector.style.display = "flex";
		global.id.mainStateStyleSelector2.style.display = "flex";
		global.id.mainStateStyleContextInfo.style.display = "none";
		populatePropertyValue(undefined, true);
	});

	global.id.openAddStateProperty.addEventListener("click", () => {
		global.id.mainStateStyleSelector.style.display = "none";
		global.id.mainStateStyleAdd.style.display = "flex";
		global.id.mainStateStyleSelector2.style.display = "none";
		populatePropertySelectAll(cssProperties, true);
		// resolveElementStateSelect();
	});

	global.id.mainStateSelectorBack.addEventListener("click", () => {
		global.id.mainStyleSelector.style.display = "flex";
		global.id.mainStyleSelector2.style.display = "flex";
		global.id.mainStateSelector.style.display = "none";
		global.id.mainStateStyleContextInfo.style.display = "none";
		global.id.elementSelect.value = global.variable.memoryElement;
		global.id.nameHelper.textContent = global.variable.memoryElement;
		populatePropertyValue(undefined, false);

		// const selectedValue = global.id.stateOf.textContent;
		// const element = getElementFromPath();
		// updateElementInfo(selectedValue, element);
	});

	global.id.mainStateStyleSelectorBack.addEventListener("click", () => {
		global.id.mainStateSelector.style.display = "flex";
		global.id.mainStateStyleSelector.style.display = "none";
		global.id.mainStateStyleSelector2.style.display = "none";
		resolveElementStateSelect();
	});

	global.id.openAddState.addEventListener("click", () => {
		populateStateSelectAllOptions();
		global.id.mainStateSelector.style.display = "none";
		global.id.mainStateAdd.style.display = "flex";
		global.id.mainStateStyleContextInfo.style.display = "none";
	});

	global.id.addState.addEventListener("click", () => {
		console.log("Add state clicked"); // debugging
		const stateSelectAll = global.id.stateSelectAll;
		const elementSelect = global.id.elementSelect;
		const selectedState = stateSelectAll.value;
		const selectedElement = elementSelect.value;
		let currentMap;
		if (global.id.navAdditionalScreen.classList.contains("screenDesktop")) {
			currentMap = cssMap;
		} else if (
			global.id.navAdditionalScreen.classList.contains("screenTablet")
		) {
			currentMap = mediaQueriesMap.get("max-width: 768px");
		} else if (
			global.id.navAdditionalScreen.classList.contains("screenMobile")
		) {
			currentMap = mediaQueriesMap.get("max-width: 640px");
		}
		let fullPath;
		if (stateSelectAll.value === "has") {
			console.log("has"); // debugging
			fullPath = `${selectedElement}:${selectedState}(${global.id.selectContext.value}:${global.id.selectStateOfContext.value})`;
		} else {
			console.log("not has"); // debugging
			fullPath = `${selectedElement}:${selectedState}`;
		}
		console.log("fullPath", fullPath); // debugging
		currentMap.set(fullPath, "");
		global.id.mainStateSelector.style.display = "flex";
		global.id.mainStateAdd.style.display = "none";
		populateElementStateOptions();
		resolveElementStateSelect();
	});

	global.id.closeAddState.addEventListener("click", () => {
		global.id.mainStateSelector.style.display = "flex";
		global.id.mainStateAdd.style.display = "none";
		resolveElementStateSelect();
	});

	global.id.openAddElement.addEventListener("click", () => {
		global.variable.parent = global.id.elementSelect.value;
		populateElementSelectAll();
		global.id.mainInitialSelector.style.display = "none";
		global.id.mainElementAdd.style.display = "flex";
	});

	function backToMainInitialSelector() {
		global.id.mainInitialSelector.style.display = "flex";
		global.id.mainElementAdd.style.display = "none";
	}
	global.id.closeAddElement.addEventListener("click", () => {
		backToMainInitialSelector();
	});

	/**
	 * Event handler for the add element button.
	 * When the button is clicked, the selected element is added to the iframe DOM.
	 * The selected element is also added to the element selector.
	 * @todo Media queries should be also updated.
	 */
	global.id.addElement.addEventListener("click", () => {
		/** @type {string} */
		const selectedValue = global.id.elementSelectAll.value;
		function countSibling(selectedValue) {
			/** @type {Element} parentElement */
			const parentElement = getElementFromPath();
			if (!parentElement) {
				console.error("Parent element not found");
				return 0;
			}

			/** @type {HTMLCollection} children */
			const children = parentElement.children; // Use children to get only element nodes

			// Filter children by tag name and count them
			const count = Array.from(children).filter(
				(child) => child.tagName.toLowerCase() === selectedValue.toLowerCase(),
			).length;

			return count + 1;
		}

		const fullPath = global.id.elementSelect.value;
		let newElement;
		if (["main", "header", "footer", "nav"].includes(selectedValue)) {
			newElement = `${fullPath} > ${selectedValue}`;
		} else {
			newElement = `${fullPath} > ${selectedValue}:nth-of-type(${countSibling(selectedValue)})`; // this function replaces need of using generateCssSelector.js for total rebuild (possible refractor in the future)
		}
		global.id.elementSelect.options[global.id.elementSelect.options.length] =
			new Option(newElement, newElement);
		cssMap.set(newElement, "");
		global.id.elementSelect.value = newElement;
		const newElementNode = document.createElement(selectedValue);
		const parentElement = getElementFromPath(fullPath);
		newElementNode.customTag = "cwrapPreloaded";
		parentElement.appendChild(newElementNode);
		eventListenerClickElement(newElementNode);
		updateElementInfo(newElement, null);
		applyStyles();
		populateTreeView();
		highlightSelectedElement();
		backToMainInitialSelector();
	});

	global.id.removeElement.addEventListener("click", () => {
		const selectedValue = global.id.elementSelect.value;

		if (selectedValue !== "none") {
			const element = getElementFromPath();
			if (element) {
				element.remove();
				// console.log(`Element ${selectedValue} removed from iframe.`);
			} else {
				// console.log(`Element ${selectedValue} not found in iframe.`);
			}
			// Remove all options that contain the selected value
			/**
			 * @type {HTMLOptionsCollection} options
			 */
			const options = global.id.elementSelect.options;
			for (let i = options.length - 1; i >= 0; i--) {
				if (options[i].value.includes(selectedValue)) {
					// console.log(`Option ${options[i].value} removed from selector.`);
					removeStyle(options[i].value);
					options[i].remove();
				}
			}
		}
		rebuildCssSelector();
		populateSelectOptions();
		applyStyles();
		validateRemoveElement();
		if (global.id.navSelectPreview.classList.contains("tree")) {
			populateTreeView();
			highlightSelectedElement();
		}
	});

	// global.id.openAddScreen.addEventListener("click", () => {
	// 	document.getElementById("screenSelectAllDiv").style.display = "flex";
	// 	document.getElementById("screenDiv").style.display = "none";
	// 	document.getElementById("styleRow").style.display = "none";
	// 	document.getElementById("propertyDiv").style.display = "none";
	// 	document.getElementById("propertySelectAllDiv").style.display = "none";
	// 	document.getElementById("attributeDiv").style.display = "none";
	// });

	// global.id.closeAddScreen.addEventListener("click", () => {
	// 	document.getElementById("screenSelectAllDiv").style.display = "none";
	// 	document.getElementById("screenDiv").style.display = "flex";
	// 	document.getElementById("styleRow").style.display = "block";
	// 	document.getElementById("propertyDiv").style.display = "flex";
	// 	document.getElementById("attributeDiv").style.display = "flex";
	// 	document.getElementById("screenSelectAll").value = "";
	// });

	/**
	 * Event handler for the add screen button. It adds a new screen size to the mediaQueriesMap.
	 * @param {Map} mediaQueriesMap - The map containing media queries for responsive styles.
	 */
	// document.getElementById("addScreen").addEventListener("click", () => {
	// const screenSelectAll = document.getElementById("screenSelectAll");
	// const selectedValue = screenSelectAll.value;
	// 	const elementSelectValue = document.getElementById("elementSelect").value;

	// 	if (selectedValue === "") return;
	// 	console.log("Add screen clicked"); // debugging

	// 	// Check if the screen size already exists
	// 	if (!mediaQueriesMap.has(selectedValue)) {
	// 		const valueMap = new Map();
	// 		valueMap.set(elementSelectValue, ""); // Use elementSelectValue as the key
	// 		mediaQueriesMap.set(selectedValue, valueMap);

	// 		global.id.responsiveSelect.options[
	// 			global.id.responsiveSelect.options.length
	// 		] = new Option(selectedValue, selectedValue);
	// 		console.log(`Screen size ${selectedValue} added.`);
	// 	} else {
	// 		console.log(`Screen size ${selectedValue} already exists.`);
	// 		const valueMap = mediaQueriesMap.get(selectedValue);

	// 		// Check if the elementSelectValue already exists in the inner Map
	// 		if (valueMap.has(elementSelectValue)) {
	// 			console.log(
	// 				`Element ${elementSelectValue} already exists in screen size ${selectedValue}.`,
	// 			);
	// 		} else {
	// 			valueMap.set(elementSelectValue, ""); // Use elementSelectValue as the key
	// 			console.log(
	// 				`Element ${elementSelectValue} added to screen size ${selectedValue}.`,
	// 			);
	// 		}
	// 	}

	// 	console.log("mediaQueriesMap", mediaQueriesMap); // debugging
	// });

	global.id.updateProperty.addEventListener("click", () => {
		// const classList = Array.from(
		// 	global.id.navAdditionalScreen.classList,
		// ).filter(
		// 	(className) => className !== "mediumButtons" && className !== "device",
		// );
		// const selectedScreen = classList[0]; // Assuming the third class is the one you are always looking for
		const propertySelect = global.id.propertySelect;
		const propertyInput = global.id.propertyInput;
		const fullPath = global.id.elementSelect.value;
		let currentStyle;
		let targetMap;
		let mediaQueries;
		if (global.id.navAdditionalScreen.classList.contains("screenDesktop")) {
			currentStyle = cssMap.get(fullPath);
			targetMap = cssMap;
		} else {
			if (global.id.navAdditionalScreen.classList.contains("screenTablet")) {
				currentStyle = mediaQueriesMap.get("max-width: 768px")?.get(fullPath);
				mediaQueries = mediaQueriesMap.get("max-width: 768px");
			} else {
				currentStyle = mediaQueriesMap.get("max-width: 640px")?.get(fullPath);
				mediaQueries = mediaQueriesMap.get("max-width: 640px");
			}
			const mediaQuery = mediaQueries?.get(fullPath);
			currentStyle = mediaQuery;
			targetMap = mediaQueries;
		}

		const styleProperties = currentStyle
			?.split(";")
			.filter(Boolean)
			.map((prop) => prop.trim());

		const selectedProperty = propertySelect.value;
		const newValue = propertyInput.value;

		const newStyle = `${styleProperties
			?.map((prop) => {
				const [key] = prop.split(":").map((item) => item.trim());
				return key === selectedProperty ? `${key}: ${newValue}` : prop;
			})
			.join("; ")};`;

		console.log("newStyle", newStyle); // debugging
		console.log("targetMap", targetMap); // debugging
		if (targetMap) targetMap.set(fullPath, newStyle);
		applyStyles();
		global.variable.style = newStyle;
	});

	global.id.updateStateProperty.addEventListener("click", () => {
		console.log("updateStateProperty clicked"); // debugging
		const statePropertySelect = global.id.statePropertySelect;
		const statePropertyInput = global.id.statePropertyInput;
		console.log("statePropertyInput.value", statePropertyInput.value); // debugging
		const fullPath = global.id.elementStateSelect.value;
		const selectedProperty = statePropertySelect.value;
		const newValue = statePropertyInput.value;
		const currentStyle = cssMap.get(fullPath) || "";
		const styleProperties = currentStyle
			.split(";")
			.filter(Boolean)
			.map((prop) => prop.trim());
		let newStyle = styleProperties;
		console.log("newStyle", newStyle); // debugging
		const propertyExists = styleProperties.some((prop) =>
			prop.startsWith(selectedProperty),
		);
		if (propertyExists) {
			console.log("Property exists"); // debugging
			newStyle = newStyle.map((prop) => {
				const [key] = prop.split(":").map((item) => item.trim());
				console.log("prop", prop); // debugging
				console.log("key", key); // debugging
				console.log("selectedProperty", selectedProperty); // debugging
				console.log("newValue", newValue); // debugging
				console.log("key === selectedProperty", key === selectedProperty); // debugging
				console.log("`${key}: ${newValue}`", `${key}: ${newValue}`); // debugging
				return key === selectedProperty ? `${key}: ${newValue}` : prop;
			});
		} else {
			console.log("Property does not exist"); // debugging
			newStyle.push(`${selectedProperty}: ${newValue}`);
		}
		console.log("newStyle", newStyle); // debugging
		cssMap.set(fullPath, newStyle.join("; ").concat(";"));
		applyStyles();
		global.variable.style = newStyle.join("; ").concat(";");
	});

	global.id.updateAttribute.addEventListener("click", () => {
		const attributeSelect = global.id.attributeSelect;
		const attributeInput = global.id.attributeInput;
		const selectedAttribute = attributeSelect.value;
		const newValue = attributeInput.value;

		const element = getElementFromPath();
		if (element) {
			element.setAttribute(selectedAttribute, newValue);
		}
	});

	global.id.removeProperty.addEventListener("click", () => {
		const fullPath = global.id.elementSelect.value;
		const propertySelect = global.id.propertySelect;
		let styleSpan = global.variable.style;
		const selectedProperty = propertySelect.value;
		const currentStyle = cssMap.get(fullPath) || "";
		const styleProperties = currentStyle
			.split(";")
			.map((prop) => prop.trim())
			.filter(Boolean);
		const newStyle = styleProperties
			.filter((prop) => !prop.startsWith(selectedProperty))
			.join("; ")
			.concat(";");
		cssMap.set(fullPath, newStyle);
		applyStyles(rootMap, cssMap, mediaQueriesMap);
		styleSpan = newStyle;
		updatePropertySelectOptions();
	});

	global.id.removeStateProperty.addEventListener("click", () => {
		console.log("removeStateProperty clicked"); // debugging
		const fullPath = global.id.elementStateSelect.value;
		const statePropertySelect = global.id.statePropertySelect;
		const selectedProperty = statePropertySelect.value;
		const currentStyle = cssMap.get(fullPath) || "";
		const styleProperties = currentStyle
			.split(";")
			.map((prop) => prop.trim())
			.filter(Boolean);
		const newStyle = styleProperties;
		const propertyExists = styleProperties.some((prop) =>
			prop.startsWith(selectedProperty),
		);
		if (propertyExists) {
			console.log("Property exists"); // debugging
			const newStyle = styleProperties.filter(
				(prop) => !prop.startsWith(selectedProperty),
			);
			cssMap.set(fullPath, newStyle.join("; ").concat(";"));
			applyStyles();
			global.variable.style = newStyle.join("; ").concat(";");
			updatePropertySelectOptions(true);
			populatePropertyValue(undefined, true);
		}
	});
};

global.id.navLvlRouteBack.addEventListener("click", () => {
	global.id.mask.style.display = "flex";
	global.id.popupBackend.style.display = "flex";
	// window.history.replaceState(null, "", "/");
	// loadMenuLevelView();
	// loadRoutesView();
	// populateRoutesView();
});

global.id.popupBackendConfirm.addEventListener("click", () => {
	global.id.mask.style.display = "none";
	window.history.replaceState(null, "", "/");
	loadMenuLevelView();
	loadRoutesView();
	populateRoutesView();
	populateThemeOptions();
});

global.id.popupBackendReject.addEventListener("click", () => {
	global.id.mask.style.display = "none";
	global.id.popupBackend.style.display = "none";
});

global.id.elementStateSelect.addEventListener("change", () => {
	resolveElementStateSelect();
});

global.id.navSelectionStatic.addEventListener("click", () => {
	console.log("navSelectionStatic clicked"); // debugging
	try {
		fetch("/api/open-folder/static");
	} catch (error) {
		console.error("Error fetching static data:", error);
	}
});

global.id.navSelectionBuild.addEventListener("click", () => {
	console.log("navSelectionBuilder clicked"); // debugging
	try {
		fetch("/api/build");
	} catch (error) {
		console.error("Error fetching builder data:", error);
	}
});

global.id.navSelectionBuildRoutes.addEventListener("click", () => {
	loadRoutesView();
	populateRoutesView();
});

global.id.navLvlMenuSettings.addEventListener("click", () => {
	resolveInitialSettings();
	loadSettingsView();
});

global.id.navLvlMenuTheme.addEventListener("change", (option) => {
	localStorage.setItem("theme", option.target.value);
	loadTheme(option.target.value);
	populateThemeOptions();
	populateRoutesView();
	if (global.settings.empty !== true) createInitialSettings(global.settings);
});

global.id.creatorExtend.addEventListener("click", () => {
	const fontMap = global.map.fontMap;
	const rootMap = global.map.rootMap;
	const wizardTitle = global.id.wizardTitle.textContent.split(" ")[0];
	if (wizardTitle === "Head") {
		console.log("creatorExtend Head"); // debugging
	} else if (wizardTitle === "Fonts") {
		fontMap.get("fonts").push({
			"font-family": "",
			src: "",
			"font-display": "",
		});
		onLoadPopulateFontsCreator();
	} else if (wizardTitle === "Root") {
		let variableName = "--newVariable";
		let counter = 2;
		while (rootMap.has(variableName)) {
			variableName = `--newVariable${counter}`;
			counter++;
		}
		rootMap.set(variableName, "");
		onLoadPopulateRootCreator();
	}
});

global.id.settingsTreeFirstTimeCreateSettings.addEventListener("click", () => {
	createInitialSettings();
});

global.id.navClassroom.addEventListener("click", () => {
	global.id.mainInitialSelector.style.display = "none";
	global.id.selectedElementHighlight.style.display = "none";
	global.id.mainClassroomSelector.style.display = "flex";
	populateClassroomSelectType();
	populateClassroomSelectName();
});
global.id.mainClassroomSelectorSelectType.addEventListener("change", () => {
	populateClassroomSelectName();
});

global.id.navJavascript.addEventListener("click", () => {
	//debugging (commented out)
	//centralBarCleanup();
	//global.id.mainInitialSelector.style.display = "none";
	//global.id.selectedElementHighlight.style.display = "none";
});

global.id.editBlueprint.addEventListener("click", () => {
	global.id.mainInitialSelector.style.display = "none";
	global.id.mainBlueprintSelector.style.display = "flex";
	populateSelectBlueprintOptions();
	validateRemoveElement(true);
	validateParentElement(true);
});

global.id.mainBlueprintSelectorCounter.addEventListener("click", () => {
	global.id.mainBlueprintSelector.style.display = "none";
	global.id.mainBlueprintCounter.style.display = "flex";

	function populateCounter() {
		const blueprintMap = global.map.blueprintMap;
		const selector = getElementFromPath().timeStamp;
		const currentMap = blueprintMap.get(selector);
		global.id.mainBlueprintCounterInput.value = currentMap.count;
	}
	populateCounter();
});

global.id.mainBlueprintSelectorBack.addEventListener("click", () => {
	global.id.mainInitialSelector.style.display = "flex";
	global.id.mainBlueprintSelector.style.display = "none";
});

global.id.blueprintSelect.addEventListener("change", () => {
	validateRemoveElement(true);
	validateParentElement(true);
});

/**
 * @typedef {import('./types.js').JsonObject} JsonObject
 */

/**
 * Generates a CSS selector string based on the provided JSON object.
 * @param {JsonObject} jsonObj - The JSON object representing the element.
 * @param {string} [parentSelector=""] - The CSS selector of the parent element.
 * @param {Map} [siblingCountMap=new Map()] - A Map to keep track of sibling elements count.
 */
function generateCssSelectorFromBlueprint(
	jsonObj,
	parentSelector = "",
	siblingCountMap = new Map(),
) {
	const cssMap = global.map.cssMap;
	const mediaQueriesMap = global.map.mediaQueriesMap;
	let selector = parentSelector;

	if (jsonObj.element) {
		const element = jsonObj.element;

		if (!siblingCountMap.has(parentSelector)) {
			siblingCountMap.set(parentSelector, new Map());
		}
		const parentSiblingCount = siblingCountMap.get(parentSelector);

		if (element === "body" || element === "main" || element === "footer") {
			selector += (parentSelector ? " > " : "") + element;
		} else {
			if (!parentSiblingCount.has(element)) {
				parentSiblingCount.set(element, 0);
			}
			parentSiblingCount.set(element, parentSiblingCount.get(element) + 1);
			selector += ` > ${element}:nth-of-type(${parentSiblingCount.get(element)})`;
		}

		if (jsonObj.style && jsonObj.customTag !== "cwrapBlueprintCSS") {
			cssMap.set(selector, jsonObj.style);
		} else {
			cssMap.set(selector, "");
		}

		if (Array.isArray(jsonObj.extend)) {
			for (const extension of jsonObj.extend) {
				const extendedSelector = `${selector}${extension.extension}`;
				cssMap.set(extendedSelector, extension.style);
			}
		}

		if (jsonObj.mediaQueries) {
			for (const mediaQuery of jsonObj.mediaQueries) {
				const mediaQuerySelector = `${selector}`;
				if (!mediaQueriesMap.has(mediaQuery.query)) {
					mediaQueriesMap.set(mediaQuery.query, new Map());
				}
				mediaQueriesMap
					.get(mediaQuery.query)
					.set(mediaQuerySelector, mediaQuery.style);
			}
		}

		if (jsonObj.children) {
			for (const child of jsonObj.children) {
				generateCssSelectorFromBlueprint(child, selector, siblingCountMap);
			}
		}

		if (jsonObj.blueprint) {
			jsonObj.customTag = "cwrapBlueprintCSS";
			const blueprint = jsonObj.blueprint;
			for (let i = 0; i < blueprint.count; i++) {
				const blueprintChild = JSON.parse(JSON.stringify(blueprint));
				blueprintChild.element = blueprint.element;
				blueprintChild.children = blueprint.children;
				blueprintChild.customTag = "cwrapBlueprintCSS";
				generateCssSelectorFromBlueprint(
					blueprintChild,
					selector,
					siblingCountMap,
				);
			}
		}

		if (jsonObj.count) {
			for (let i = 0; i + 1 < Number.parseInt(jsonObj.count, 10); i++) {
				const { count, ...clonedJsonObj } = JSON.parse(JSON.stringify(jsonObj));
				generateCssSelectorFromBlueprint(
					clonedJsonObj,
					parentSelector,
					siblingCountMap,
				);
			}
		}
	}
}

/**
 * Rebuilds the styles from the blueprint.
 */
function rebuildStyleFromBlueprint() {
	const blueprintMap = global.map.blueprintMap;
	const currentElement = getElementFromPath();
	const selector = currentElement.timeStamp;
	const currentMap = blueprintMap.get(selector);

	if (currentMap) {
		generateCssSelectorFromBlueprint(
			currentMap,
			getElementPath(currentElement),
			new Map(),
		);
	}
}

/**
 * Updates the blueprint counter and rebuilds the element.
 */
function updateBlueprintCounter() {
	const blueprintMap = global.map.blueprintMap;
	const selector = getElementFromPath().timeStamp;
	const currentMap = blueprintMap.get(selector);
	currentMap.count = global.id.mainBlueprintCounterInput.value;
	reloadBlueprint();
	const selectedValue = global.id.elementSelect.value;
	const firstChildrenTag =
		getElementFromPath(selectedValue).childNodes[0].tagName.toLowerCase();
	removeStyle(`${selectedValue} > ${firstChildrenTag}`);
	rebuildStyleFromBlueprint();
	applyStyles();
}

// Attach the event listener
global.id.mainBlueprintCounterUpdate.addEventListener(
	"click",
	updateBlueprintCounter,
);

global.id.mainBlueprintCounterBack.addEventListener("click", () => {
	global.id.mainBlueprintCounter.style.display = "none";
	global.id.mainBlueprintSelector.style.display = "flex";
});

global.id.mainBlueprintTextEditorUpdateBlueprintText.addEventListener(
	"click",
	() => {
		const blueprintMap = global.map.blueprintMap;
		const selector = getElementFromPath().timeStamp;
		const currentMap = blueprintMap.get(selector);
		const selectedBlueprintElement = global.id.blueprintSelect.value;
		const selectedBlueprintElementTrimmed = selectedBlueprintElement
			.replace(">", "")
			.trim();
		const textValue = global.id.mainBlueprintTextEditor2.value;

		function updateTextInMap(map, elementPath, newText) {
			const pathParts = elementPath.split(" > ");
			let currentElement = map;

			for (const part of pathParts) {
				const [elementName, nthOfType] = part.split(":nth-of-type(");
				const index = nthOfType
					? Number.parseInt(nthOfType.replace(")", ""), 10) - 1
					: 0;

				if (currentElement.element === elementName) {
					if (index !== 0) {
						return false;
					}
				} else if (
					currentElement.children &&
					Array.isArray(currentElement.children)
				) {
					const matchingChildren = currentElement.children.filter(
						(child) => child.element === elementName,
					);
					if (matchingChildren.length > index) {
						currentElement = matchingChildren[index];
					} else {
						return false;
					}
				} else {
					return false;
				}
			}
			currentElement.text = newText;
			return true;
		}

		updateTextInMap(currentMap, selectedBlueprintElementTrimmed, textValue);
		reloadBlueprint();
	},
);

// populateRoutesView();
// loadMenuLevelView();
// loadRoutesView();
if (new URLSearchParams(window.location.search).has("param")) {
	const param = new URLSearchParams(window.location.search).get("param");
	//TODO Refractor code to not use LoadBodyView() before any view
	if (param === "fonts") {
		loadBodyView();
		loadFontsView();
	} else if (param === "head") {
		loadBodyView();
		loadHeadView();
	} else if (param === "root") {
		loadBodyView();
		loadRootView();
	}
} else {
	loadBodyView();
}

if (new URLSearchParams(window.location.search).has("stage")) {
	const stage = new URLSearchParams(window.location.search).get("stage");
	console.log("stage", stage); // debugging
}

// Function to handle keydown events
const iframe = global.id.preview;
function handleKeydown(event) {
	const keyMap = {
		ctrl: event.ctrlKey,
		shift: event.shiftKey,
		alt: event.altKey,
		meta: event.metaKey,
	};
	const allKeysPressed = (
		global.settings.keybindings
			? global.settings.keybindings["toggle cwrap control in preview"]
			: "ctrl+shift+h"
	)
		.split("+")
		.every(
			(key) => keyMap[key] || event.key.toLowerCase() === key.toLowerCase(),
		);
	if (allKeysPressed) {
		const iframe = document.querySelector("iframe");
		if (iframe) {
			iframe.classList.toggle("cwrap-only");
		}
	}
}

// Function to handle keydown events for changing selection color
function handleChangeSelectionColor(event) {
	const keyMap = {
		ctrl: event.ctrlKey,
		shift: event.shiftKey,
		space: event.code === "Space",
		" ": event.code === "Space",
	};
	const allKeysPressed = (
		global.settings.keybindings
			? global.settings.keybindings["toggle highlight control in preview"]
			: "ctrl+shift+space"
	)
		.split("+")
		.every((key) => keyMap[key]);

	if (allKeysPressed) {
		const iframe = document.querySelector("iframe");
		const selectedColor =
			global.localSettings.selectionColor === "red"
				? "green"
				: global.localSettings.selectionColor === "green"
					? "blue"
					: "red";
		global.localSettings.selectionColor = selectedColor;
		localStorage.setItem("selectionColor", global.localSettings.selectionColor);
	}
}

// Add event listener to the document
document.addEventListener("keydown", handleKeydown);
if (iframe) {
	try {
		iframe.contentWindow.addEventListener("keydown", handleKeydown);
		iframe.contentWindow.addEventListener(
			"keydown",
			handleChangeSelectionColor,
		);
	} catch (e) {
		console.error("Cannot access iframe content: ", e);
	}
}
// global.id.sectionsVariables.value = "root";
// localStorage.setItem("hideArrow", "true");
// document.body.style.display = "flex";
export default eventHandlers;
