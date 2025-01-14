// Check if the code is running inside an iframe
const isInIframe = window !== window.parent;

// Get URL parameters based on the environment
const urlParams = Object.fromEntries(
	new URLSearchParams(
		isInIframe ? window.parent.location.search : window.location.search,
	).entries() ?? [],
);
// console.log("URL Parameters:", urlParams);

/**
 * Logs every element in the document body and replaces placeholders with values from URL parameters.
 */
function logAndReplacePlaceholders() {
	// console.log(
	// 	"Starting to log every element in the document body and replace placeholders",
	// );
	// console.log("Document body:", document.body);

	// Function to log each element and replace placeholders in text content and attributes
	function logAndReplaceElement(element) {
		if (element.nodeType === Node.TEXT_NODE) {
			// console.log("Text Node:", element.nodeValue);
			element.nodeValue = element.nodeValue.replace(
				/cwrapGetParams\[(.*?)\]/g,
				(_, param) => {
					return urlParams[param] || "";
				},
			);
			for (const [param, value] of Object.entries(urlParams)) {
				const placeholder = `cwrapGetParams[${param}]`;
				if (element.nodeValue.includes(placeholder)) {
					// console.log(`Found placeholder in text node: ${element.nodeValue}`);
					element.nodeValue = element.nodeValue.replace(
						new RegExp(placeholder, "g"),
						value,
					);
					console.log(`Updated Text Node: ${element.nodeValue}`);
				}
			}
		} else if (element.nodeType === Node.ELEMENT_NODE) {
			// console.log("Element:", element);
			for (const attr of element.attributes) {
				for (const [param, value] of Object.entries(urlParams)) {
					const placeholder = `cwrapGetParams[${param}]`;
					if (attr.value.includes(placeholder)) {
						console.log(
							`Found placeholder in attribute: ${attr.name}="${attr.value}"`,
						);
						attr.value = attr.value.replace(
							new RegExp(placeholder, "g"),
							value,
						);
						console.log(`Updated attribute: ${attr.name}="${attr.value}"`);
					}
				}
			}
			for (const child of element.childNodes) {
				logAndReplaceElement(child);
			}
		}
	}

	// Start logging and replacing from the document body
	logAndReplaceElement(document.body);

	// console.log(
	// 	"Completed logging every element in the document body and replacing placeholders",
	// );
}

// Call the function to log every element and replace placeholders
logAndReplacePlaceholders();
