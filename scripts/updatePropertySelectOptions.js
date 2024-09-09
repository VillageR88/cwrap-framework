/**
 * Updates the options in the property select dropdown based on the current styles.
 *
 * @param {string} fullPath - The full path of the element.
 * @param {Map} cssMap - The map of full paths to styles.
 */
export default function updatePropertySelectOptions(fullPath, cssMap) {
  // Get the property select element by its ID
  const propertySelect = document.getElementById("propertySelect");
  // Get the current style for the full path from the cssMap or set it to an empty string if not found
  const currentStyle = cssMap.get(fullPath) || "";
  // Split the current style string into individual properties, filter out empty strings, and trim whitespace
  /**
   * @type {string[]}
   */
  const styleProperties = currentStyle
    .split(";")
    .filter(Boolean)
    .map((prop) => prop.trim());

  // Clear any existing options in the property select element
  propertySelect.innerHTML = "";
  // Iterate over each style property
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

  // Get the property input element by its ID
  const propertyInput = document.getElementById("propertyInput");
  // Set an event listener for when the selected option in the property select element changes
  propertySelect.onchange = () => {
    // Get the selected property key
    const selectedProperty = propertySelect.value;
    // Find the corresponding property value from the style properties
    const selectedValue =
      styleProperties.length > 0
        ? styleProperties
            .find((prop) => prop.startsWith(selectedProperty))
            .split(":")[1]
            .trim()
        : "";
    // Set the value of the property input element to the selected property value
    propertyInput.value = selectedValue;
  };

  // Trigger the onchange event for the propertySelect to initialize the input field
  propertySelect.onchange();
}
