/**
 * @type {import('./_globals.js')}
 */
import validateRemoveElement from "./validateRemoveElement.js";
import validateParentElement from "./validateParentElement.js";

/**
 * Updates the element information based on the full path.
 * @todo resolve issue when clicking on element that is in the middle of the select based update
 * @param {string} fullPath - The full path of the element.
 * @param {HTMLElement} element - The DOM element.
 * @param {Map} cssMap - The map of CSS styles.
 * @param {Map} mediaQueriesMap - The map of media queries.
 */
export default function updateElementInfo(fullPath, element) {
  const cssMap = global.map.cssMap;
  const mediaQueriesMap = global.map.mediaQueriesMap;
  const nameHelper = global.id.nameHelper;

  // Set the value of the select element to the full path
  nameHelper.textContent = fullPath;
  let style = global.variable.style;
  let currentStyle;
  if (global.id.navAdditionalScreen.classList.contains("screenDesktop")) {
    currentStyle = cssMap.get(fullPath);
  } else {
    let selectedValue;
    if (global.id.navAdditionalScreen.classList.contains("screenTablet"))
      selectedValue = "max-width: 768px";
    else if (global.id.navAdditionalScreen.classList.contains("screenMobile"))
      selectedValue = "max-width: 640px";
    else if (global.id.navAdditionalScreen.classList.contains("screenCustom")) {
      selectedValue = global.id.navScreenCustom.value;
    }
    const mediaQueries = mediaQueriesMap.get(selectedValue);
    const mediaQuery = mediaQueries?.get(fullPath);
    style = mediaQuery || "No media query style";
    currentStyle = mediaQuery;
  }
  style = currentStyle;

  //because sometimes you select something like something:hover and it will not be selected that is why we need to check if the element
  if (element) {
    // Define the keyframes for the combined glowing effect

    const selectionColor = {
      red: "rgba(255, 0, 0, 1)",
      green: "rgba(0, 255, 0, 1)",
      blue: "rgba(0, 0, 255, 1)",
    };
    const selected = global.localSettings.selectionColor;

    const keyframes = [
      {
        boxShadow: `0 0 10px ${selectionColor[selected]} inset, 0 0 10px ${selectionColor[selected]}`,
      },
      {
        boxShadow: `0 0 20px ${selectionColor[selected].replace(
          "1",
          "0.5"
        )} inset, 0 0 20px ${selectionColor[selected].replace("1", "0.5")}`,
      },
      {
        boxShadow: `0 0 10px ${selectionColor[selected]} inset, 0 0 10px ${selectionColor[selected]}`,
      },
    ];

    // Define the timing options for the animation
    const options = {
      duration: 500, // Duration in milliseconds
      iterations: 1, // Number of times the animation should repeat
    };

    // Apply the combined animation to the element
    element.animate(keyframes, options);
  }

  // Split the current style string into individual properties, filter out empty strings, and trim whitespace
  /**
   * @type {string[]} selectedValue
   */
  let styleProperties;
  if (currentStyle)
    styleProperties = currentStyle
      .split(";")
      .filter(Boolean)
      .map((prop) => prop.trim());
  // Get the property select element by its ID
  const propertySelect = global.id.propertySelect;
  // Clear any existing options in the property select element
  const propertySelectMemory = propertySelect.value;
  propertySelect.innerHTML = "";
  // Iterate over each style property using for...of loop
  if (currentStyle)
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

  //populateAttributeOptions(previewDocument);
  //populateAttributeOptionsValue();

  validateRemoveElement();
  validateParentElement(undefined, element.isTemplateElementAnchor);
  global.id.elementSelect.value = nameHelper.textContent;
  global.id.mainTemplatesSelectorParent.value = nameHelper.textContent;
}
