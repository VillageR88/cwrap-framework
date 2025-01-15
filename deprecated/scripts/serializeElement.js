import { notNthEnumerableElements } from "./_const.js";
/**
 * Serialize the DOM element to JSON. In other words convert the DOM element to a JSON object with styles appended and others like class, attributes.
 *
 * @param {HTMLElement} element - The DOM element to serialize.
 * @param {Map<string,string>} extendMap - The extended styles map.
 * @returns {Object|null} The serialized element or null if the element does not have the customTag property set to cwrapPreloaded.
 */
export default function serializeElement(element, extendMap) {
  if (
    element.customTag === "cwrapPreviewWindow" ||
    element.customTag === "cwrapTempScript" ||
    element.isPlaceholder === true
  )
    return null;

  if (element.isTemplateElement && !element.isTemplateElementAnchor) return;
  if (element.isTemplateElementAnchor) {
    console.log(element);
    return {
      element: "cwrap-template",
      text: `cwrapTemplate[${element.templateElement}]`,
    };
  }
  const cssMap = global.map.cssMap;
  const mediaQueriesMap = global.map.mediaQueriesMap;
  const obj = {
    element: element.tagName.toLowerCase(),
  };

  // Serialize attributes
  if (element.attributes) {
    obj.attributes = [];
    for (let i = 0; i < element.attributes.length; i++) {
      if (element.attributes[i].name !== "style") {
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

  // Handle extended styles
  for (const [key, value] of extendMap.entries()) {
    const regExp2 = /(?!>)\S\s(\S+)$/;
    if (key.match(regExp2)) {
      const selectorWithoutElementSelectedTrimmed = selector
        .replace(global.id.elementSelect.value, "")
        .trim();
      if (selectorWithoutElementSelectedTrimmed.length === 0) {
        if (!obj.extend) obj.extend = [];
        obj.extend.push({ extension: ` ${key.match(regExp2)[1]}`, style: value });
      }
    } else {
      const keyBase = key.split(/[:.#]+(?!nth-of-type)/)[0];
      const keySelector = key.split(/[:.#]+(?!nth-of-type)/)[1];
      const selectorBase = selector.split(/[:.#]+(?!nth-of-type)/)[0];
      const selectorSymbol = key.replace(keyBase, "").replace(keySelector, "");
      if (keyBase === selectorBase) {
        if (!obj.extend) obj.extend = [];
        obj.extend.push({ extension: selectorSymbol + keySelector, style: value });
      }
    }
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
      if (child.customTag === "cwrapBlueprint") continue;
      const serializedChild = serializeElement(child, extendMap);
      if (serializedChild) {
        obj.children.push(serializedChild);
      }
    }
  }

  if (element.customTag === "cwrapBlueprintContainer") {
    obj.blueprint = global.map.blueprintMap.get(element.timeStamp);
    return obj;
  }

  // if (element.customTag2 === "cwrapNewBlueprintParent") {
  // 	obj.blueprint = {};
  // 	return obj;
  // }

  // Serialize text content if it exists and is not part of a child element
  // Serialize text content if it exists and is not part of a child element
  const originalText = element.cwrapText;
  if (originalText) {
    obj.text = originalText.trim();
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

  if (
    !notNthEnumerableElements.includes(
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

  // Traverse up the DOM tree to build the full selector path
  let parent = element.parentElement;
  while (parent && parent.tagName.toLowerCase() !== "html") {
    let parentSelector = parent.tagName.toLowerCase();

    if (
      !notNthEnumerableElements.includes(parent.tagName.toLowerCase())
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

    selector = `${parentSelector} > ${selector}`;
    parent = parent.parentElement;
  }

  return selector;
}
