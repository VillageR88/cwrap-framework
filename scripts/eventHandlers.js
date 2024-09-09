import updateElementInfo from "./updateElementInfo.js";
import populatePropertySelectAll from "./populatePropertySelectAll.js";
import toggleFlexDirection from "./toggleFlexDirection.js";
import applyStyles from "./applyStyles.js";
import updatePropertySelectOptions from "./updatePropertySelectOptions.js";
import validateRemoveElement from "./validateRemoveElement.js";
import removeStyle from "./removeStyle.js";
import rebuildCssSelector from "./rebuildCssSelector.js";
import populateSelectOptions from "./populateSelectOptions.js";
import populateElementStateOptions from "./populateElementStateOptions.js";
import populateStateSelectAllOptions from "./populateStateSelectAllOptions.js";
import populateAttributeOptions from "./populateAttributeOptions.js";
import validateParentElement from "./validateParentElement.js";
import populateElementSelectAll from "./populateElementSelectAll.js";
import populateAttributeOptionsValue from "./populateAttributeOptionsValue.js";
import resolveToggleContext from "./resolveToggleContext.js";
import loadPreview from "./loadPreview.js";

const SKELETON_SOURCE_SKELETON_BODY = "templates/skeletonBody.json";
const SKELETON_SOURCE_SKELETON_BODY_TEST = "templates/skeletonBody_test.json";
const DEBUG_RESTART_PROJECT_ID = "debugRestartProject";
const MENU_SAVE_ID = "menuSave";
const MENU_RELOAD_ID = "menuReload";
const PARENT_ID = "parent";
const FLEX_DIRECTION_BUTTON_ID = "toggleFlexDirection";
const ELEMENT_SELECT_ALL_DIV_ID = "elementSelectAllDiv";
const ELEMENT_SELECT_ID = "elementSelect";
const RESPONSIVE_SELECT_ID = "responsiveSelect";
const ELEMENT_DIV_ID = "elementDiv";
const OPEN_ADD_ELEMENT_ID = "openAddElement";
const CLOSE_ADD_ELEMENT_ID = "closeAddElement";
const ADD_ELEMENT_ID = "addElement";
const OPEN_ADD_SCREEN_ID = "openAddScreen";
const ClOSE_ADD_SCREEN_ID = "closeAddScreen";
const ADD_SCREEN_ID = "addScreen";
const ELEMENT_REMOVE_ID = "removeElement";
const STYLE_SPAN_ID = "style";
const PREVIEW_ID = "preview";
const PROPERTY_SELECT_ALL_DIV_ID = "propertySelectAllDiv";
const PROPERTY_DIV_ID = "propertyDiv";
const OPEN_ADD_PROPERTY_ID = "openAddProperty";
const CLOSE_ADD_PROPERTY_ID = "closeAddProperty";
const ADD_PROPERTY_ID = "addProperty";
const UPDATE_PROPERTY_ID = "updateProperty";
const REMOVE_PROPERTY_ID = "removeProperty";
const PROPERTY_SELECT_ID = "propertySelect";
const PROPERTY_INPUT_ID = "propertyInput";

/**
 * Sets up the event handlers for the element select change.
 * @param {Map} cssMap - The map containing CSS values for elements.
 * @param {Map} mediaQueriesMap - The map containing media queries for responsive styles.
 * @param {Array} cssProperties - The array containing CSS properties.
 */
export const setupElementSelectChangeHandler = (
  cssMap,
  mediaQueriesMap,
  cssProperties
) => {
  document.getElementById(ELEMENT_SELECT_ID).addEventListener("change", () => {
    const selectedValue = document.getElementById(ELEMENT_SELECT_ID).value;
    const preview = document.getElementById(PREVIEW_ID);
    const previewDocument =
      preview.contentDocument || preview.contentWindow.document;
    const element = previewDocument.querySelector(selectedValue);
    updateElementInfo(selectedValue, element, cssMap, mediaQueriesMap);
    populatePropertySelectAll(selectedValue, cssMap, cssProperties);
  });
};

/**
 * Sets up the event handlers for the screen size select change.
 * @param {Map} cssMap - The map containing CSS values for elements.
 * @param {Map} mediaQueriesMap - The map containing media queries for responsive styles.
 */
export const setupScreenSizeSelectChangeHandler = (cssMap, mediaQueriesMap) => {
  document
    .getElementById(RESPONSIVE_SELECT_ID)
    .addEventListener("change", () => {
      const previewDocument =
        preview.contentDocument || preview.contentWindow.document;
      const selectedValue = document.getElementById(ELEMENT_SELECT_ID).value;
      const element = previewDocument.querySelector(selectedValue);
      updateElementInfo(
        document.getElementById(ELEMENT_SELECT_ID).value,
        element,
        cssMap,
        mediaQueriesMap
      );
    });
};

/**
 * Sets up the event handlers for the screen size select change.
 * @param {Map} cssMap - The map containing CSS values for elements.
 * @param {Map} mediaQueriesMap - The map containing media queries for responsive styles.
 */
export const setupPropertySelectChangeHandler = (cssMap, mediaQueriesMap) => {
  document.getElementById(PROPERTY_SELECT_ID).addEventListener("change", () => {
    const previewDocument =
      preview.contentDocument || preview.contentWindow.document;
    const selectedValue = document.getElementById(ELEMENT_SELECT_ID).value;
    const element = previewDocument.querySelector(selectedValue);
    updateElementInfo(
      document.getElementById(ELEMENT_SELECT_ID).value,
      element,
      cssMap,
      mediaQueriesMap
    );
  });
};

export const setupAttributeSelectChangeHandler = () => {
  document.getElementById("attributeSelect").addEventListener("change", () => {
    populateAttributeOptionsValue();
  });
};

export const setupStateSelectAllChangeHandler = (cssMap, mediaQueriesMap) => {
  document.getElementById("stateSelectAll").addEventListener("change", () => {
    resolveToggleContext();
  });
};

//bellow we will write function for setupMenuHandlers
/**
 * Sets up the event handlers for the menu.
 * @param {Map} fontMap - The map containing font styles.
 * @param {Map} cssMap - The map containing CSS values for elements.
 * @param {Map} mediaQueriesMap - The map containing media queries for responsive styles.
 */
export function setupMenuHandlers(fontMap, cssMap, mediaQueriesMap) {
  /**
   * Event handler for the restart project button.
   * When the button is clicked, the data from skeletonBody_test.json is loaded into the iframe.
   */
  document.getElementById(DEBUG_RESTART_PROJECT_ID).onclick = () => {
    //clear the cssMap and mediaQueriesMap
    fontMap.clear();
    cssMap.clear();
    mediaQueriesMap.clear();
    //load the preview
    loadPreview(
      SKELETON_SOURCE_SKELETON_BODY_TEST,
      fontMap,
      cssMap,
      mediaQueriesMap
    );
  };

  /**
   * Event handler for the save button.
   * When the button is clicked, the data from the iframe is saved to skeletonBody.json.
   * @param {Map} fontMap - The map containing font styles.
   */
  const extendMap = new Map();
  document.getElementById(MENU_SAVE_ID).onclick = () => {
    console.log("Save clicked"); //debugging
    for (const [key, value] of cssMap) {
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
     * @param {Map} cssMap - A Map to store CSS styles.
     * @param {Map} mediaQueriesMap - A Map to store media queries.
     * @returns {Object} The serialized element.
     */
    function serializeElement(element, cssMap, mediaQueriesMap) {
      // console.log("Serializing element:", element); // I think i need only this element not nested children
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
          obj.children.push(serializeElement(child, cssMap, mediaQueriesMap));
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
          element.tagName.toLowerCase()
        )
      ) {
        const siblings = Array.from(element.parentElement.children).filter(
          (sibling) =>
            sibling.tagName.toLowerCase() === element.tagName.toLowerCase()
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
            parent.tagName.toLowerCase()
          )
        ) {
          const siblings = Array.from(parent.parentElement.children).filter(
            (sibling) =>
              sibling.tagName.toLowerCase() === parent.tagName.toLowerCase()
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
    const preview = document.getElementById("preview");
    const previewDocument =
      preview.contentDocument || preview.contentWindow.document;

    const bodyJson = serializeElement(
      previewDocument.body,
      cssMap,
      mediaQueriesMap
    );

    const finalJson =
      fontMap.size > 0
        ? { fonts: Object.fromEntries(fontMap).fonts, ...bodyJson }
        : bodyJson;

    // Send the JSON object to the server
    fetch("/save-skeleton-body", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(finalJson),
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
  };

  /**
   * Event handler for the reload button.
   * When the button is clicked, the data from skeletonBody.json is loaded into the iframe.
   */
  document.getElementById(MENU_RELOAD_ID).onclick = () => {
    console.log("Reload clicked"); //debugging
    fontMap.clear();
    cssMap.clear();
    mediaQueriesMap.clear();
    loadPreview(
      SKELETON_SOURCE_SKELETON_BODY,
      fontMap,
      cssMap,
      mediaQueriesMap
    );
  };
}

/**
 * Sets up the event handlers for element.
 * @param {Map} cssMap - The map containing CSS values for elements.
 * @param {Map} mediaQueriesMap - The map containing media queries for responsive styles.
 *
 */
export function setupElementHandlers(cssMap, mediaQueriesMap) {
  const parent = document.getElementById(PARENT_ID);
  const elementSelect = document.getElementById(ELEMENT_SELECT_ID);
  const elementSelectAllDiv = document.getElementById(
    ELEMENT_SELECT_ALL_DIV_ID
  );
  const propertySelectAllDiv = document.getElementById(
    PROPERTY_SELECT_ALL_DIV_ID
  );
  const elementDiv = document.getElementById(ELEMENT_DIV_ID);
  const propertyDiv = document.getElementById(PROPERTY_DIV_ID);

  document.getElementById("openState").onclick = () => {
    document.getElementById("elementStateDiv").style.display = "flex";
    // elementDiv.style.display = "none";
    // propertyDiv.style.display = "none";
    // document.getElementById("attributeDiv").style.display = "none";
    document.getElementById("elementHeaderDiv").style.display = "none";
    document.getElementById("elementSelect").style.display = "none";
    const elementName = document.getElementById("elementSelect").value;
    document.getElementById("stateOf").textContent = elementName;
    populateElementStateOptions(cssMap, mediaQueriesMap);
  };

  document.getElementById("closeState").onclick = () => {
    document.getElementById("elementStateDiv").style.display = "none";
    document.getElementById("elementHeaderDiv").style.display = "flex";
    document.getElementById("elementSelect").style.display = "flex";
    document.getElementById("attributeDiv").style.display = "flex";
    const selectedValue = document.getElementById("stateOf").textContent;
    const preview = document.getElementById(PREVIEW_ID);
    const previewDocument =
      preview.contentDocument || preview.contentWindow.document;
    const element = previewDocument.querySelector(selectedValue);
    updateElementInfo(selectedValue, element, cssMap, mediaQueriesMap);
  };

  document.getElementById("openAddState").onclick = () => {
    document.getElementById("elementDiv").style.display = "none";
    document.getElementById("propertyDiv").style.display = "none";
    document.getElementById("attributeDiv").style.display = "none";
    document.getElementById("stateHeaderDiv").style.display = "none";
    document.getElementById("elementStateSelect").style.display = "none";
    document.getElementById("stateSelectAllDiv").style.display = "flex";
    populateStateSelectAllOptions(cssMap, mediaQueriesMap);
  };

  document.getElementById("closeAddState").onclick = () => {
    document.getElementById("elementDiv").style.display = "flex";
    document.getElementById("propertyDiv").style.display = "flex";
    document.getElementById("attributeDiv").style.display = "flex";
    document.getElementById("stateHeaderDiv").style.display = "flex";
    document.getElementById("elementStateSelect").style.display = "flex";
    document.getElementById("stateSelectAllDiv").style.display = "none";
    document.getElementById("contextSelectAllDiv").style.display = "none";
    document.getElementById("stateOfContextSelectAllDiv").style.display = "none";
  };

  document.getElementById(OPEN_ADD_ELEMENT_ID).onclick = () => {
    elementDiv.style.display = "none";
    propertyDiv.style.display = "none";
    elementSelectAllDiv.style.display = "flex";
    propertySelectAllDiv.style.display = "none";
    document.getElementById("screenSelectAllDiv").style.display = "none";
    document.getElementById("attributeDiv").style.display = "none";
    parent.textContent = elementSelect.value;
    populateElementSelectAll();
  };

  document.getElementById(CLOSE_ADD_ELEMENT_ID).onclick = () => {
    elementDiv.style.display = "flex";
    propertyDiv.style.display = "flex";
    document.getElementById("attributeDiv").style.display = "flex";

    elementSelectAllDiv.style.display = "none";
  };

  /**
   * Event handler for the add element button.
   * When the button is clicked, the selected element is added to the iframe DOM.
   * The selected element is also added to the element selector.
   * @todo Media queries should be also updated.
   */
  document.getElementById(ADD_ELEMENT_ID).onclick = () => {
    elementDiv.style.display = "flex";
    propertyDiv.style.display = "flex";
    elementSelectAllDiv.style.display = "none";

    const elementSelectAll = document.getElementById("elementSelectAll");
    const selectedValue = elementSelectAll.value;
    const fullPath = elementSelect.value;
    const newElement = `${fullPath} > ${selectedValue}`;
    elementSelect.options[elementSelect.options.length] = new Option(
      newElement,
      newElement
    );
    cssMap.set(newElement, "");
    elementSelect.value = newElement;
    updateElementInfo(newElement, null, cssMap, mediaQueriesMap);
    const preview = document.getElementById(PREVIEW_ID);
    const previewDocument =
      preview.contentDocument || preview.contentWindow.document;
    const parentElement = previewDocument.querySelector(fullPath);
    const newElementNode = document.createElement(selectedValue);
    parentElement.appendChild(newElementNode);
    console.log(`Element ${selectedValue} added to iframe.`);
    applyStyles(cssMap, mediaQueriesMap);
    validateParentElement();
  };

  document.getElementById(ELEMENT_REMOVE_ID).onclick = () => {
    const elementSelect = document.getElementById(ELEMENT_SELECT_ID);
    const selectedValue = elementSelect.value;

    if (selectedValue !== "none") {
      const preview = document.getElementById(PREVIEW_ID);
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
    applyStyles(cssMap, mediaQueriesMap);
    validateRemoveElement();
  };
}

/**
 * Sets up the event handlers for screen.
 * @param {Map} mediaQueriesMap - The map containing media queries for responsive styles.
 */
export function setupScreenHandlers(mediaQueriesMap) {
  document.getElementById(OPEN_ADD_SCREEN_ID).onclick = () => {
    document.getElementById("screenSelectAllDiv").style.display = "flex";
    document.getElementById("screenDiv").style.display = "none";
    document.getElementById("styleRow").style.display = "none";
    document.getElementById("propertyDiv").style.display = "none";
    document.getElementById("propertySelectAllDiv").style.display = "none";
    document.getElementById("attributeDiv").style.display = "none";
  };

  document.getElementById("closeAddScreen").onclick = () => {
    document.getElementById("screenSelectAllDiv").style.display = "none";
    document.getElementById("screenDiv").style.display = "flex";
    document.getElementById("styleRow").style.display = "block";
    document.getElementById("propertyDiv").style.display = "flex";
    document.getElementById("attributeDiv").style.display = "flex";
    document.getElementById("screenSelectAll").value = "";
  };

  /**
   * Event handler for the add screen button. It adds a new screen size to the mediaQueriesMap.
   * @param {Map} mediaQueriesMap - The map containing media queries for responsive styles.
   */
  document.getElementById("addScreen").onclick = () => {
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

      const responsiveSelect = document.getElementById(RESPONSIVE_SELECT_ID);
      responsiveSelect.options[responsiveSelect.options.length] = new Option(
        selectedValue,
        selectedValue
      );
      console.log(`Screen size ${selectedValue} added.`);
    } else {
      console.log(`Screen size ${selectedValue} already exists.`);
      const valueMap = mediaQueriesMap.get(selectedValue);

      // Check if the elementSelectValue already exists in the inner Map
      if (valueMap.has(elementSelectValue)) {
        console.log(
          `Element ${elementSelectValue} already exists in screen size ${selectedValue}.`
        );
      } else {
        valueMap.set(elementSelectValue, ""); // Use elementSelectValue as the key
        console.log(
          `Element ${elementSelectValue} added to screen size ${selectedValue}.`
        );
      }
    }

    console.log("mediaQueriesMap", mediaQueriesMap); // debugging
  };
}

/**
 * Sets up the event handlers for property.
 *
 * @param {Map} cssMap - The map containing CSS values for elements.
 * @param {Map} mediaQueriesMap - The map containing media queries for responsive styles.
 * @param {Array} cssProperties - The array containing CSS properties.
 */
export function setupPropertyHandlers(cssMap, mediaQueriesMap, cssProperties) {
  const propertySelectAllDiv = document.getElementById(
    PROPERTY_SELECT_ALL_DIV_ID
  );
  const propertyDiv = document.getElementById(PROPERTY_DIV_ID);

  document.getElementById(OPEN_ADD_PROPERTY_ID).onclick = () => {
    propertySelectAllDiv.style.display = "flex";
    propertyDiv.style.display = "none";
    document.getElementById("attributeDiv").style.display = "none";
    populatePropertySelectAll(
      document.getElementById(ELEMENT_SELECT_ID).value,
      cssMap,
      cssProperties
    );
  };

  document.getElementById(CLOSE_ADD_PROPERTY_ID).onclick = () => {
    propertySelectAllDiv.style.display = "none";
    propertyDiv.style.display = "flex";
    document.getElementById("attributeDiv").style.display = "flex";
  };

  document.getElementById(ADD_PROPERTY_ID).onclick = () => {
    propertySelectAllDiv.style.display = "none";
    propertyDiv.style.display = "flex";
    const propertySelectAll = document.getElementById("propertySelectAll");
    // const propertyInput = document.getElementById(PROPERTY_INPUT_ID); // commented out for now
    const fullPath = document.getElementById(ELEMENT_SELECT_ID).value;
    const selectedProperty = propertySelectAll.value; // Use propertySelectAll for new property
    // const newValue = propertyInput.value; // commented out for now
    const newValue = ""; // Use empty string for new property for now
    const currentStyle = cssMap.get(fullPath) || "";
    const styleProperties = currentStyle
      .split(";")
      .map((prop) => prop.trim())
      .filter(Boolean);
    // Check if the property already exists
    const propertyExists = styleProperties.some((prop) =>
      prop.startsWith(selectedProperty)
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
    applyStyles(cssMap, mediaQueriesMap);
    document.getElementById(STYLE_SPAN_ID).textContent = newStyle;
    updatePropertySelectOptions(fullPath, cssMap);
    document.getElementById(PROPERTY_SELECT_ID).value = selectedProperty;
    document.getElementById(PROPERTY_INPUT_ID).value = ""; // Clear the input field for now
  };

  document.getElementById(UPDATE_PROPERTY_ID).onclick = () => {
    const propertySelect = document.getElementById(PROPERTY_SELECT_ID);
    const propertyInput = document.getElementById(PROPERTY_INPUT_ID);
    const fullPath = document.getElementById(ELEMENT_SELECT_ID).value;
    let currentStyle;
    let targetMap;

    if (document.getElementById(RESPONSIVE_SELECT_ID).value === "any") {
      currentStyle = cssMap.get(fullPath);
      targetMap = cssMap;
    } else {
      const styleSpan = document.getElementById(STYLE_SPAN_ID);
      const selectedValue = document.getElementById(RESPONSIVE_SELECT_ID).value;
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

    let newStyle;
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
    applyStyles(cssMap, mediaQueriesMap);
    document.getElementById(STYLE_SPAN_ID).textContent = newStyle;
  };

  document.getElementById(REMOVE_PROPERTY_ID).onclick = () => {
    const propertySelect = document.getElementById(PROPERTY_SELECT_ID);
    const fullPath = document.getElementById(ELEMENT_SELECT_ID).value;
    const styleSpan = document.getElementById(STYLE_SPAN_ID);
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
    applyStyles(cssMap, mediaQueriesMap);
    styleSpan.textContent = newStyle;
    updatePropertySelectOptions(fullPath, cssMap);
  };

  document.getElementById(FLEX_DIRECTION_BUTTON_ID).onclick = () => {
    toggleFlexDirection();
  };
}
