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
} from "./loadView.js";
import populateAttributeSelectAll from "./populateAttributeSelectAll.js";
import populatePropertyValue from "./populatePropertyValue.js";
import populateAttributeOptions from "./populateAttributeOptions.js";
import serializeElement from "./serializeElement.js";
import populateTreeView from "./populateTreeView.js";
import highlightSelectedElement from "./highlightSelectedElement.js";
import getElementFromPath from "./getElementFromPath.js";
import resolveElementStateSelect from "./resolveElementStateSelect.js";
// import initializeAwesomplete from "./initializeAwesomplete.js";

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
	//initializeAwesomplete(cssProperties);

	const headMap = global.map.headMap;
	const rootMap = global.map.rootMap;
	const fontMap = global.map.fontMap;
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

	function tempUpdateFunction() {
		const element = getElementFromPath();
		updateElementInfo(global.id.elementSelect.value, element);
	}

	global.id.navScreenDesktop.addEventListener("click", () => {
		global.id.navAdditionalScreen.classList.remove(
			"screenDesktop",
			"screenTablet",
			"screenMobile",
		);
		global.id.navAdditionalScreen.classList.add("screenDesktop");
		const preview = global.id.preview;
		preview.style.width = "100%";
		tempUpdateFunction();
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
		tempUpdateFunction();
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
		tempUpdateFunction();
	});
	global.id.navPreviewNormal.addEventListener("click", () => {
		global.id.navSelectPreview.classList.remove("preview", "static", "tree");
		global.id.navSelectPreview.classList.add("preview");
		global.id.preview.style.display = "flex";
		global.id.previewTree.style.display = "none";
		global.id.navAdditionalScreen.style.display = "flex";
		global.id.mainInitialSelector.style.display = "flex";
		global.id.selectedElementHighlight.style.display = "flex";
	});
	global.id.navPreviewStatic.addEventListener("click", () => {
		global.id.navSelectPreview.classList.remove("preview", "tree");
		global.id.navSelectPreview.classList.add("static");
		global.id.preview.style.display = "flex";
		global.id.previewTree.style.display = "none";
		global.id.navAdditionalScreen.style.display = "flex";
		global.id.mainInitialSelector.style.display = "flex";
		global.id.selectedElementHighlight.style.display = "flex";
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
			element.classList.add("glowing");
		}
		nameHelper.style.display = "flex";
	});

	const handleEventStopGlowing = () => {
		const nameHelper = global.id.nameHelper;
		const element = getElementFromPath();
		if (element) {
			element.classList.remove("glowing");
		}
		nameHelper.style.display = "none";
	};

	global.id.selectedElementHighlight.addEventListener(
		"mouseleave",
		handleEventStopGlowing,
	);
	global.id.selectedElementHighlight.addEventListener("mouseup", handleEventStopGlowing);

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
	const extendMap = global.map.extendMap;
	global.id.menuSave.addEventListener("click", () => {
		creatorSave();
		console.log("Save clicked"); //debugging
		for (const [key, _] of cssMap) {
			if (key.includes(":has")) {
				const newKey = key.split(":has")[0];
				const newValue = `:has${key.split(":has")[1]}`;
				extendMap.set(newKey, newValue);
			} else if (key.includes(":hover")) {
				const newKey = key.split(":hover")[0];
				const newValue = `:hover${key.split(":hover")[1]}`;
				extendMap.set(newKey, newValue);
			}
		}

		/**
		 * @type {JsonObject} bodyJson
		 */
		let bodyJson = serializeElement(global.id.doc.body);

		if (rootMap.size > 0) {
			const root = {};
			for (const [key, value] of rootMap.entries()) {
				root[key] = value;
			}
			bodyJson = { root, ...bodyJson };
		}

		if (fontMap.size > 0) {
			let fonts = {};
			for (const [key, value] of fontMap.entries()) {
				fonts[key] = value;
			}
			fonts = fonts.fonts;
			bodyJson = { fonts, ...bodyJson };
		}

		if (headMap.size > 0) {
			const head = {};
			for (const [key, value] of headMap.entries()) {
				head[key] = value;
			}
			bodyJson = { head, ...bodyJson };
		}

		console.log(bodyJson); //debugging
		fetch("/save-skeleton", {
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
	});

	/**
	 * Event handler for the reload button.
	 * When the button is clicked, the data from skeletonBody.json is loaded into the iframe.
	 */
	global.id.menuReload.addEventListener("click", () => {
		initialLoader();
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
		const propertyExists = styleProperties.some((prop) =>
			prop.startsWith(selectedProperty),
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
		updatePropertySelectOptions();
		global.id.statePropertySelect.value = selectedProperty;
		global.id.statePropertyInput.value = ""; // Clear the input field for now
		global.id.mainStateStyleSelector2.style.display = "flex";
		console.log("Add state property clicked"); // debugging
	});

	global.id.mainStateStyleAddBack.addEventListener("click", () => {
		global.id.mainStateStyleSelector.style.display = "flex";
		global.id.mainStateStyleAdd.style.display = "none";
		// populatePropertyValue(global.variable.memoryElement);
	});

	global.id.addProperty.addEventListener("click", () => {
		const propertySelectAll = global.id.propertySelectAll;
		const fullPath = global.id.elementSelect.value;
		const selectedProperty = propertySelectAll.value;
		const newValue = "";
		const currentStyle = cssMap.get(fullPath) || "";
		const styleProperties = currentStyle
			.split(";")
			.map((prop) => prop.trim())
			.filter(Boolean);
		// Check if the property already exists
		const propertyExists = styleProperties.some((prop) =>
			prop.startsWith(selectedProperty),
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
		populatePropertySelectAll(cssProperties);
		resolveElementStateSelect();
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
		let fullPath;
		if (stateSelectAll.value === "has") {
			console.log("has"); // debugging
			fullPath = `${selectedElement}:${selectedState}(${global.id.selectContext.value}:${global.id.selectStateOfContext.value})`;
		} else {
			console.log("not has"); // debugging
			fullPath = `${selectedElement}:${selectedState}`;
		}
		console.log("fullPath", fullPath); // debugging
		cssMap.set(fullPath, "");
		global.id.mainStateSelector.style.display = "flex";
		global.id.mainStateAdd.style.display = "none";
		populateElementStateOptions();
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
		const newElement = `${fullPath} > ${selectedValue}:nth-of-type(${countSibling(selectedValue)})`; // this function replaces need of using generateCssSelector.js for total rebuild (possible refractor in the future)
		global.id.elementSelect.options[global.id.elementSelect.options.length] =
			new Option(newElement, newElement);
		cssMap.set(newElement, "");
		global.id.elementSelect.value = newElement;
		updateElementInfo(newElement, null);
		console.log("fullPath", fullPath); // debugging
		const parentElement = getElementFromPath(fullPath);
		const newElementNode = document.createElement(selectedValue);
		parentElement.appendChild(newElementNode);
		console.log(`Element ${selectedValue} added to iframe.`);
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
					removeStyle(cssMap, mediaQueriesMap, options[i].value);
					options[i].remove();
				}
			}
		}
		rebuildCssSelector();
		populateSelectOptions();
		applyStyles();
		validateRemoveElement();
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
		const classList = Array.from(
			global.id.navAdditionalScreen.classList,
		).filter(
			(className) => className !== "mediumButtons" && className !== "device",
		);
		const selectedValue = classList[0]; // Assuming the third class is the one you are always looking for
		const propertySelect = global.id.propertySelect;
		const propertyInput = global.id.propertyInput;
		const fullPath = global.id.elementSelect.value;
		let currentStyle;
		let targetMap;

		if (global.id.navAdditionalScreen.classList.contains("screenDesktop")) {
			currentStyle = cssMap.get(fullPath);
			targetMap = cssMap;
		} else {
			let styleSpan = global.variable.style;
			if (global.id.navAdditionalScreen.classList.contains("screenTablet"))
				currentStyle = mediaQueriesMap.get("max-width: 768px").get(fullPath);
			else currentStyle = mediaQueriesMap.get("max-width: 640px").get(fullPath);
			const mediaQueries = mediaQueriesMap.get(selectedValue);
			const mediaQuery = mediaQueries.get(fullPath);
			styleSpan = mediaQuery || "No media query style";
			currentStyle = mediaQuery;
			targetMap = mediaQueries;
		}

		const styleProperties = currentStyle
			.split(";")
			.filter(Boolean)
			.map((prop) => prop.trim());

		const selectedProperty = propertySelect.value;
		const newValue = propertyInput.value;

		const newStyle = `${styleProperties
			.map((prop) => {
				const [key] = prop.split(":").map((item) => item.trim());
				return key === selectedProperty ? `${key}: ${newValue}` : prop;
			})
			.join("; ")};`;

		console.log("newStyle", newStyle); // debugging
		targetMap.set(fullPath, newStyle);
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
			updatePropertySelectOptions();
		}
	});
};

global.id.elementStateSelect.addEventListener("change", () => {
	resolveElementStateSelect();
});

const input = global.id.stateContextInfo;
let isDragging = false;
let startX;

input.addEventListener("mousedown", (e) => {
	isDragging = true;
	startX = e.clientX; // Get the initial mouse position
	e.preventDefault(); // Prevent default text selection behavior
});

document.addEventListener("mousemove", (e) => {
	if (isDragging) {
		const moveX = e.clientX - startX; // Calculate how much the mouse has moved
		input.scrollLeft -= moveX; // Scroll the input text left or right
		startX = e.clientX; // Update the start position
	}
});

document.addEventListener("mouseup", () => {
	isDragging = false; // Stop dragging when the mouse is released
});

loadBodyView();
// global.id.sectionsVariables.value = "root";
localStorage.setItem("hideArrow", "true");
document.body.style.display = "flex";

export default eventHandlers;
