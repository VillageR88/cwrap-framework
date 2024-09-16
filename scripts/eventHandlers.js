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
import { skeletonSourceSkeletonBody } from "./_const.js";

/**
 * Sets up the event handlers.
 * @param {Array} cssProperties - The array containing CSS properties.
 */
export const eventHandlers = (cssProperties) => {
	const headMap = global.map.headMap;
	const rootMap = global.map.rootMap;
	const fontMap = global.map.fontMap;
	const cssMap = global.map.cssMap;
	const mediaQueriesMap = global.map.mediaQueriesMap;

	document;
	global.id.sectionsVariables.addEventListener("change", () => {
		switch (global.id.sectionsVariables.value) {
			case "head":
				loadHeadView();
				break;
			case "body":
				loadBodyView();
				break;
			case "fonts":
				loadFontsView();
				break;
			case "root":
				loadRootView();
				break;
		}
	});

	//document element id onlyLogo on mouse enter display none
	global.id.onlyLogo.addEventListener("mouseenter", () => {
		global.id.onlyLogo.style.display = "none";
		global.id.handOnLogo.style.display = "none";
		global.id.leftSidebar.style.display = "flex";
	});

	global.id.leftSidebar.addEventListener("mouseleave", () => {
		global.id.onlyLogo.style.display = "flex";
		global.id.leftSidebar.style.display = "none";
	});

	global.id.leftSidebarSwitchSide.addEventListener("click", () => {
		global.id.onlyLogo.classList.toggle(global.class.right);
		global.id.leftSidebar.classList.toggle(global.class.right);
	});

	global.id.elementSelect.addEventListener("change", () => {
		const selectedValue = global.id.elementSelect.value;
		const previewDocument =
			global.id.preview.contentDocument ||
			global.id.preview.contentWindow.document;
		const element = previewDocument.querySelector(selectedValue);
		updateElementInfo(selectedValue, element, cssMap, mediaQueriesMap);
		populatePropertySelectAll(selectedValue, cssMap, cssProperties);
	});

	global.id.responsiveSelect.addEventListener("change", () => {
		const previewDocument =
			global.id.preview.contentDocument ||
			global.id.preview.contentWindow.document;
		const selectedValue = global.id.elementSelect.value;
		const element = previewDocument.querySelector(selectedValue);
		updateElementInfo(
			global.id.elementSelect.value,
			element,
			cssMap,
			mediaQueriesMap,
		);
	});

	global.id.propertySelect.addEventListener("change", () => {
		const previewDocument =
			global.id.preview.contentDocument ||
			global.id.preview.contentWindow.document;
		const selectedValue = global.id.elementSelect.value;
		const element = previewDocument.querySelector(selectedValue);
		updateElementInfo(
			global.id.elementSelect.value,
			element,
			cssMap,
			mediaQueriesMap,
		);
	});

	global.id.attributeSelect.addEventListener("change", () => {
		populateAttributeOptionsValue();
	});

	global.id.stateSelectAll.addEventListener("change", () => {
		resolveToggleContext();
	});

	global.id.creatorSave.addEventListener("click", () => {
		creatorSave();
	});

	/**
	 * Event handler for the save button.
	 * When the button is clicked, the data from the iframe is saved to skeletonBody.json.
	 */
	const extendMap = new Map();
	global.id.menuSave.addEventListener("click", () => {
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
		 * Serialize the DOM element to JSON.
		 *
		 * @param {HTMLElement} element - The DOM element to serialize.
		 * @returns {Object} The serialized element.
		 */
		function serializeElement(element) {
			const cssMap = global.map.cssMap;
			const mediaQueriesMap = global.map.mediaQueriesMap;
			const obj = {
				element: element.tagName.toLowerCase(),
			};

			if (element.className) {
				obj.class = element.className;
			}

			if (element.attributes) {
				obj.attributes = [];
				for (let i = 0; i < element.attributes.length; i++) {
					if (
						element.attributes[i].name !== "class" &&
						element.attributes[i].name !== "style"
					) {
						obj.attributes.push({
							name: element.attributes[i].name,
							value: element.attributes[i].value,
						});
					}
				}
				if (obj.attributes.length === 0) {
					obj.attributes = undefined;
				} else {
					const attributesObj = {};
					for (const attr of obj.attributes) {
						attributesObj[attr.name] = attr.value;
					}
					obj.attributes = attributesObj;
				}
			}

			// Append styles if they exist in the cssMap
			const selector = generateCssSelectorForElement(element);
			if (cssMap.has(selector)) {
				obj.style = cssMap.get(selector);
			}

			if (extendMap.has(selector)) {
				const newSelector = selector + extendMap.get(selector);
				const newStyle = cssMap.get(newSelector);
				obj.extend = [{ extension: extendMap.get(selector), style: newStyle }];
			}

			// Append media queries if they exist in the mediaQueriesMap
			const mediaQueries = [];
			for (const [query, elementsMap] of mediaQueriesMap.entries()) {
				if (elementsMap.has(selector)) {
					mediaQueries.push({
						query: query,
						style: elementsMap.get(selector),
					});
				}
			}
			if (mediaQueries.length > 0) {
				obj.mediaQueries = mediaQueries;
			}

			// Serialize child elements
			if (element.children.length > 0) {
				obj.children = [];
				for (const child of element.children) {
					obj.children.push(serializeElement(child));
				}
			} else if (element.textContent) {
				obj.text = element.textContent;
			}

			return obj;
		}

		/**
		 * Generate a CSS selector for the given element.
		 *
		 * @param {HTMLElement} element - The DOM element.
		 * @returns {string} The CSS selector.
		 */
		function generateCssSelectorForElement(element) {
			let selector = element.tagName.toLowerCase();

			// Add nth-of-type for the current element if it is not body, main, nav, or footer
			if (
				!["body", "main", "nav", "footer"].includes(
					element.tagName.toLowerCase(),
				)
			) {
				const siblings = Array.from(element.parentElement.children).filter(
					(sibling) =>
						sibling.tagName.toLowerCase() === element.tagName.toLowerCase(),
				);

				if (siblings.length > 0) {
					const index = siblings.indexOf(element) + 1;
					selector += `:nth-of-type(${index})`;
				}
			}

			if (element.className) {
				selector += `.${element.className.split(" ").join(".")}`;
			}

			// Traverse up the DOM tree to build the full selector path
			let parent = element.parentElement;
			while (parent && parent.tagName.toLowerCase() !== "html") {
				let parentSelector = parent.tagName.toLowerCase();

				// Add nth-of-type for parent elements that are not body, main, nav, or footer
				if (
					!["body", "main", "nav", "footer"].includes(
						parent.tagName.toLowerCase(),
					)
				) {
					const siblings = Array.from(parent.parentElement.children).filter(
						(sibling) =>
							sibling.tagName.toLowerCase() === parent.tagName.toLowerCase(),
					);
					if (siblings.length > 0) {
						const index = siblings.indexOf(parent) + 1;
						parentSelector += `:nth-of-type(${index})`;
					}
				}

				if (parent.className) {
					parentSelector += `.${parent.className.split(" ").join(".")}`;
				}

				selector = `${parentSelector} > ${selector}`;
				parent = parent.parentElement;
			}

			return selector;
		}

		// Serialize the body element of the preview iframe
		const previewDocument =
			global.id.preview.contentDocument ||
			global.id.preview.contentWindow.document;

		/**
		 * @type {JsonObject} bodyJson
		 */
		let bodyJson = serializeElement(previewDocument.body);

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
		fetch("/save-skeleton-body", {
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

	const parent = global.id.parent;
	const elementSelect = global.id.elementSelect;
	const elementSelectAllDiv = global.id.elementSelectAllDiv;

	const elementDiv = global.id.elementDiv;
	const propertyDiv = global.id.propertyDiv;

	global.id.openState.addEventListener("click", () => {
		global.id.elementStateDiv.style.display = "flex";
		global.id.elementHeaderDiv.style.display = "none";
		global.id.elementSelect.style.display = "none";
		const elementName = global.id.elementSelect.value;
		global.id.stateOf.textContent = elementName;
		populateElementStateOptions(cssMap, mediaQueriesMap);
	});

	global.id.closeState.addEventListener("click", () => {
		global.id.elementStateDiv.style.display = "none";
		global.id.elementHeaderDiv.style.display = "flex";
		global.id.elementSelect.style.display = "flex";
		global.id.attributeDiv.style.display = "flex";
		const selectedValue = global.id.stateOf.textContent;
		const preview = global.id.preview;
		const previewDocument =
			preview.contentDocument || preview.contentWindow.document;
		const element = previewDocument.querySelector(selectedValue);
		updateElementInfo(selectedValue, element, cssMap, mediaQueriesMap);
	});

	global.id.openAddState.addEventListener("click", () => {
		document.getElementById("elementDiv").style.display = "none";
		document.getElementById("propertyDiv").style.display = "none";
		global.id.attributeDiv.style.display = "none";
		document.getElementById("stateHeaderDiv").style.display = "none";
		document.getElementById("elementStateSelect").style.display = "none";
		document.getElementById("stateSelectAllDiv").style.display = "flex";
		populateStateSelectAllOptions(cssMap, mediaQueriesMap);
	});

	global.id.closeAddState.addEventListener("click", () => {
		document.getElementById("elementDiv").style.display = "flex";
		document.getElementById("propertyDiv").style.display = "flex";
		global.id.attributeDiv.style.display = "flex";
		document.getElementById("stateHeaderDiv").style.display = "flex";
		document.getElementById("elementStateSelect").style.display = "flex";
		document.getElementById("stateSelectAllDiv").style.display = "none";
		document.getElementById("contextSelectAllDiv").style.display = "none";
		document.getElementById("stateOfContextSelectAllDiv").style.display =
			"none";
	});

	global.id.openAddElement.addEventListener("click", () => {
		elementDiv.style.display = "none";
		propertyDiv.style.display = "none";
		elementSelectAllDiv.style.display = "flex";
		propertySelectAllDiv.style.display = "none";
		document.getElementById("screenSelectAllDiv").style.display = "none";
		global.id.attributeDiv.style.display = "none";
		parent.textContent = elementSelect.value;
		populateElementSelectAll();
	});

	global.id.closeAddElement.addEventListener("click", () => {
		elementDiv.style.display = "flex";
		propertyDiv.style.display = "flex";
		global.id.attributeDiv.style.display = "flex";
		elementSelectAllDiv.style.display = "none";
	});

	/**
	 * Event handler for the add element button.
	 * When the button is clicked, the selected element is added to the iframe DOM.
	 * The selected element is also added to the element selector.
	 * @todo Media queries should be also updated.
	 */
	global.id.addElement.addEventListener("click", () => {
		elementDiv.style.display = "flex";
		propertyDiv.style.display = "flex";
		elementSelectAllDiv.style.display = "none";

		const elementSelectAll = document.getElementById("elementSelectAll");
		const selectedValue = elementSelectAll.value;
		const fullPath = elementSelect.value;
		const newElement = `${fullPath} > ${selectedValue}`;
		elementSelect.options[elementSelect.options.length] = new Option(
			newElement,
			newElement,
		);
		cssMap.set(newElement, "");
		elementSelect.value = newElement;
		updateElementInfo(newElement, null, cssMap, mediaQueriesMap);
		const preview = global.id.preview;
		const previewDocument =
			preview.contentDocument || preview.contentWindow.document;
		const parentElement = previewDocument.querySelector(fullPath);
		const newElementNode = document.createElement(selectedValue);
		parentElement.appendChild(newElementNode);
		console.log(`Element ${selectedValue} added to iframe.`);
		applyStyles();
		validateParentElement();
	});

	global.id.removeElement.addEventListener("click", () => {
		const elementSelect = global.id.elementSelect;
		const selectedValue = elementSelect.value;

		if (selectedValue !== "none") {
			const preview = global.id.preview;
			const previewDocument =
				preview.contentDocument || preview.contentWindow.document;

			// Remove the selected element and its descendants from the iframe DOM
			const element = previewDocument.querySelector(selectedValue);
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
			const options = elementSelect.options;
			for (let i = options.length - 1; i >= 0; i--) {
				if (options[i].value.includes(selectedValue)) {
					// console.log(`Option ${options[i].value} removed from selector.`);
					removeStyle(cssMap, mediaQueriesMap, options[i].value);
					options[i].remove();
				}
			}
		}
		//TODO rebuildCssSelector function need fix
		rebuildCssSelector(cssMap, mediaQueriesMap);
		populateSelectOptions(cssMap);
		applyStyles();
		validateRemoveElement();
	});

	global.id.openAddScreen.addEventListener("click", () => {
		document.getElementById("screenSelectAllDiv").style.display = "flex";
		document.getElementById("screenDiv").style.display = "none";
		document.getElementById("styleRow").style.display = "none";
		document.getElementById("propertyDiv").style.display = "none";
		document.getElementById("propertySelectAllDiv").style.display = "none";
		document.getElementById("attributeDiv").style.display = "none";
	});

	global.id.closeAddScreen.addEventListener("click", () => {
		document.getElementById("screenSelectAllDiv").style.display = "none";
		document.getElementById("screenDiv").style.display = "flex";
		document.getElementById("styleRow").style.display = "block";
		document.getElementById("propertyDiv").style.display = "flex";
		document.getElementById("attributeDiv").style.display = "flex";
		document.getElementById("screenSelectAll").value = "";
	});

	/**
	 * Event handler for the add screen button. It adds a new screen size to the mediaQueriesMap.
	 * @param {Map} mediaQueriesMap - The map containing media queries for responsive styles.
	 */
	document.getElementById("addScreen").addEventListener("click", () => {
		const screenSelectAll = document.getElementById("screenSelectAll");
		const selectedValue = screenSelectAll.value;
		const elementSelectValue = document.getElementById("elementSelect").value;

		if (selectedValue === "") return;
		console.log("Add screen clicked"); // debugging

		// Check if the screen size already exists
		if (!mediaQueriesMap.has(selectedValue)) {
			const valueMap = new Map();
			valueMap.set(elementSelectValue, ""); // Use elementSelectValue as the key
			mediaQueriesMap.set(selectedValue, valueMap);

			global.id.responsiveSelect.options[
				global.id.responsiveSelect.options.length
			] = new Option(selectedValue, selectedValue);
			console.log(`Screen size ${selectedValue} added.`);
		} else {
			console.log(`Screen size ${selectedValue} already exists.`);
			const valueMap = mediaQueriesMap.get(selectedValue);

			// Check if the elementSelectValue already exists in the inner Map
			if (valueMap.has(elementSelectValue)) {
				console.log(
					`Element ${elementSelectValue} already exists in screen size ${selectedValue}.`,
				);
			} else {
				valueMap.set(elementSelectValue, ""); // Use elementSelectValue as the key
				console.log(
					`Element ${elementSelectValue} added to screen size ${selectedValue}.`,
				);
			}
		}

		console.log("mediaQueriesMap", mediaQueriesMap); // debugging
	});

	const propertySelectAllDiv = global.id.propertySelectAllDiv;

	global.id.openAddProperty.addEventListener("click", () => {
		propertySelectAllDiv.style.display = "flex";
		propertyDiv.style.display = "none";
		document.getElementById("attributeDiv").style.display = "none";
		populatePropertySelectAll(
			global.id.elementSelect.value,
			cssMap,
			cssProperties,
		);
	});

	global.id.closeAddProperty.addEventListener("click", () => {
		propertySelectAllDiv.style.display = "none";
		propertyDiv.style.display = "flex";
		document.getElementById("attributeDiv").style.display = "flex";
	});

	global.id.addProperty.addEventListener("click", () => {
		propertySelectAllDiv.style.display = "none";
		propertyDiv.style.display = "flex";
		const propertySelectAll = document.getElementById("propertySelectAll");
		const fullPath = global.id.elementSelect.value;
		const selectedProperty = propertySelectAll.value; // Use propertySelectAll for new property
		const newValue = ""; // Use empty string for new property for now
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
		global.id.style.textContent = newStyle;
		updatePropertySelectOptions(fullPath, cssMap);
		global.id.propertySelect.value = selectedProperty;
		global.id.propertyInput.value = ""; // Clear the input field for now
	});

	global.id.updateProperty.addEventListener("click", () => {
		const propertySelect = global.id.propertySelect;
		const propertyInput = global.id.propertyInput;
		const fullPath = global.id.elementSelect.value;
		let currentStyle;
		let targetMap;
		let newStyle;

		if (global.id.responsiveSelect.value === "any") {
			currentStyle = cssMap.get(fullPath);
			targetMap = cssMap;
		} else {
			const styleSpan = global.id.style;
			const selectedValue = global.id.responsiveSelect.value;
			const mediaQueries = mediaQueriesMap.get(selectedValue);
			const mediaQuery = mediaQueries.get(fullPath);
			styleSpan.textContent = mediaQuery || "No media query style";
			currentStyle = mediaQuery;
			targetMap = mediaQueries;
		}

		const styleProperties = currentStyle
			.split(";")
			.filter(Boolean)
			.map((prop) => prop.trim());

		const selectedProperty = propertySelect.value;
		const newValue = propertyInput.value;

		if (newValue === "") {
			newStyle = `${styleProperties
				.filter((prop) => !prop.startsWith(selectedProperty))
				.join("; ")};`;
		} else {
			newStyle = `${styleProperties
				.map((prop) => {
					const [key] = prop.split(":").map((item) => item.trim());
					return key === selectedProperty ? `${key}: ${newValue}` : prop;
				})
				.join("; ")};`;
		}

		targetMap.set(fullPath, newStyle);
		applyStyles();
		global.id.style.textContent = newStyle;
	});

	global.id.removeProperty.addEventListener("click", () => {
		const propertySelect = global.id.propertySelect;
		const fullPath = global.id.elementSelect.value;
		const styleSpan = global.id.style;
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
		styleSpan.textContent = newStyle;
		updatePropertySelectOptions(fullPath, cssMap);
	});
};

loadHeadView();
// global.id.sectionsVariables.value = "root";
localStorage.setItem("hideArrow", "true");
document.body.style.display = "flex";

export default eventHandlers;
