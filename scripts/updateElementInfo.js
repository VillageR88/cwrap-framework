import validateRemoveElement from "./validateRemoveElement.js";
import validateParentElement from "./validateParentElement.js";
import populateScreenSizeOptions from "./populateScreenSizeOptions.js";
import populateAttributeOptions from "./populateAttributeOptions.js";
import populateAttributeOptionsValue from "./populateAttributeOptionsValue.js";

/**
 * Updates the element information based on the full path.
 * @todo resolve issue when clicking on element that is in the middle of the select based update
 * @param {string} fullPath - The full path of the element.
 * @param {HTMLElement} element - The DOM element.
 * @param {Map} cssMap - The map of CSS styles.
 * @param {Map} mediaQueriesMap - The map of media queries.
 */
export default function updateElementInfo(
	fullPath,
	element,
	cssMap,
	mediaQueriesMap,
) {
	const preview = global.id.preview;
	const previewDocument =
		preview.contentDocument || preview.contentWindow.document;

	const selectElement = document.getElementById("elementSelect");
	// Set the value of the select element to the full path
	selectElement.value = fullPath; //this is because when you click on iframe and not manually select the element, the select element will not be updated
	populateScreenSizeOptions(mediaQueriesMap);
	const style = document.getElementById("style");
	// const currentStyle = cssMap.get(fullPath) || "";
	let currentStyle;
	if (document.getElementById("responsiveSelect").value === "any") {
		currentStyle = cssMap.get(fullPath);
	} else {
		const STYLE_SPAN_ID = "style";
		const RESPONSIVE_SELECT_ID = "responsiveSelect";
		const styleSpan = document.getElementById(STYLE_SPAN_ID);
		const selectedValue = document.getElementById(RESPONSIVE_SELECT_ID).value;
		const mediaQueries = mediaQueriesMap.get(selectedValue);
		const mediaQuery = mediaQueries.get(fullPath);
		styleSpan.textContent = mediaQuery || "No media query style";
		currentStyle = mediaQuery;
	}
	// Update the text content of the style element with the current style
	style.textContent = currentStyle;

	//because sometimes you select something like something:hover and it will not be selected that is why we need to check if the element
	if (element) {
		// Set a red outline around the element to highlight it
		element.style.outline = "2px solid red";
		// Remove the outline after 500 milliseconds
		setTimeout(() => {
			element.style.outline = "";
		}, 500);
	}

	// Split the current style string into individual properties, filter out empty strings, and trim whitespace
	/**
	 * @type {string[]} selectedValue
	 */
	const styleProperties = currentStyle
		.split(";")
		.filter(Boolean)
		.map((prop) => prop.trim());
	// Get the property select element by its ID
	const propertySelect = global.id.propertySelect;
	// Clear any existing options in the property select element
	const propertySelectMemory = propertySelect.value;
	propertySelect.innerHTML = "";
	// Iterate over each style property using for...of loop
	for (const prop of styleProperties) {
		// Split the property into key and value, and trim whitespace
		const [key] = prop.split(":").map((item) => item.trim());
		// Create a new option element
		const option = document.createElement("option");
		// Set the value and text content of the option element to the property key
		option.value = key;
		option.textContent = key;
		// Append the option element to the property select element
		propertySelect.appendChild(option);
	}
	if (
		propertySelectMemory &&
		propertySelect.querySelector(`option[value="${propertySelectMemory}"]`)
	) {
		propertySelect.value = propertySelectMemory;
	}

	// Define a function to update the property input value
	function updatePropertyInput() {
		// Get the property input element by its ID
		const propertyInput = global.id.propertyInput;
		// Get the selected property key
		const propertySelect = global.id.propertySelect.value; //trying to make it more modular WiP
		// Find the corresponding property value from the style properties
		const selectedValue =
			styleProperties.length > 0
				? styleProperties
						.find((prop) => prop.startsWith(propertySelect))
						.split(":")[1]
						.trim()
				: "";
		// Set the value of the property input element to the selected property value
		propertyInput.value = selectedValue;
	}
	updatePropertyInput();
	populateAttributeOptions(previewDocument);
	populateAttributeOptionsValue();
	validateRemoveElement();
	validateParentElement();
}
