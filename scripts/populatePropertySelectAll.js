/**
 * Populates the property select element with all available CSS properties
 * that are not currently applied to the element specified by the full path.
 *
 * @param {string} fullPath - The full path of the element.
 * @param {Map} cssMap - The map of CSS styles.
 * @param {Array} cssProperties - The object containing all CSS properties.
 */
export default function populatePropertySelectAll(
  fullPath,
  cssMap,
  cssProperties
) {
  // Get the current style for the full path from the cssMap or set it to an empty string if not found
  const currentStyle = cssMap.get(fullPath) || "";
  // Split the current style string into individual properties, filter out empty strings, and trim whitespace
  const appliedProperties = currentStyle
    .split(";")
    .filter(Boolean)
    .map((prop) => prop.split(":")[0].trim());

  // Get the property select element by its ID
  const propertySelectAll = document.getElementById("propertySelectAll");
  // Clear any existing options in the property select element
  propertySelectAll.innerHTML = "";

  // Iterate over each property in the cssProperties object
  for (const property in cssProperties) {
    // If the property is not already applied, create a new option element
    if (!appliedProperties.includes(property)) {
      const option = document.createElement("option");
      // Set the value and text content of the option element to the property
      option.value = property;
      option.textContent = property;
      // Append the option element to the property select element
      propertySelectAll.appendChild(option);
    }
  }
}
