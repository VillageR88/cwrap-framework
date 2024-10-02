/**
 * @typedef {Object} Awesomplete
 * @property {function} evaluate - Evaluates the list of suggestions.
 * @property {Array} list - The list of suggestions.
 */

/**
 * Initializes the Awesomplete instance for the property input field.
 * @todo this function could be optimized way more
 * this if (awesomplete.ul.childNodes.length === 0) is temporary
 * @param {Object} cssProperties - The CSS properties object.
 */
export default function initializeAwesomplete(cssProperties) {
	const propertyInput = document.getElementById("propertyInput");
	const propertySelect = document.getElementById("propertySelect");
	const screenSelectAll = document.getElementById("screenSelectAll");

	/**
	 * Initialize the Awesomplete instance for the property input field
	 * @type {Awesomplete}
	 */
	const awesomplete = new Awesomplete(propertyInput, {
		minChars: 0,
	});

	// Initialize Awesomplete for screenSelectAll
	const responsiveAwesomplete = new Awesomplete(screenSelectAll, {
		minChars: 0,
	});

	propertySelect.addEventListener("change", () => {
		retrieveAwesompleteValue();
	});

	function retrieveAwesompleteValue() {
		const selectedProperty = propertySelect.value;
		if (selectedProperty)
			awesomplete.list = cssProperties[selectedProperty].values;
	}

	propertyInput.addEventListener("focus", () => {
		if (awesomplete.ul.childNodes.length === 0) {
			retrieveAwesompleteValue();
		}
		awesomplete.evaluate();
	});

	screenSelectAll.addEventListener("focus", () => {
		const initialList = [
			"max-width: 640px",
			"max-width: 768px",
			"max-width: 1024px",
			"max-width: 1280px",
			"max-width: 1440px",
		];
		for (const key of document.getElementById("responsiveSelect").options) {
			initialList.map((item) => {
				if (item === key.value) {
					initialList.splice(initialList.indexOf(item), 1);
				}
			});
		}
		responsiveAwesomplete.list = initialList;
		responsiveAwesomplete.evaluate();
	});
}

document.addEventListener("DOMContentLoaded", () => {
	propertySelect.dispatchEvent(new Event("change"));
});
