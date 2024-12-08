import { notNthEnumerableElements } from "./_const.js";

/**
 * @typedef {import("../types").JsonObject} JsonObject // TODO: verify need of this import
 * @type {import('./_globals.js')}
 * 
 */
import getElementFromPath from "./getElementFromPath.js";
import populateTreeView from "./populateTreeView.js";
import generateCssSelector from "./generateCssSelector.js";
import applyStyles from "./applyStyles.js";
import populateSelectOptions from "./populateSelectOptions.js";
import serializeElement from "./serializeElement.js";
import createElementFromJson from "./createElementFromJson.js";
import updateElementInfo from "./updateElementInfo.js";
import populateAttributeOptions from "./populateAttributeOptions.js";
import populateStateOfContextSelectAllOptions from "./populateStateOfContextSelectAllOptions.js";
import getElementPath from "./getElementPath.js";
import highlightSelectedElement from "./highlightSelectedElement.js";

// Function to update jsonObj based on the current DOM structure
const rootMap = global.map.rootMap;
const fontMap = global.map.fontMap;
const headMap = global.map.headMap;

// Function to update the state and reflect changes

// Function to nest an element in another element
export default function nestElementInElement(draggedValue, targetValue) {
    //TODO: nesting element in current parent but end position is not correct
    console.log("Nesting element...");
    console.log("Dragged Value:", draggedValue);
    console.log("Target Value:", targetValue);

    remapStyles(draggedValue, targetValue);
    const targetElement = getElementFromPath(targetValue);
    const draggedElement = getElementFromPath(draggedValue);

    console.log("Target Element:", targetElement);
    console.log("Dragged Element:", draggedElement);

    targetElement.appendChild(draggedElement);
    update();
    applyStyles();
    populateSelectOptions();
    populateStateOfContextSelectAllOptions();
    populateTreeView();
    highlightSelectedElement();
}

function remapStyles(draggedSelector, targetSelector) {
    const cssMap = global.map.cssMap;
    const extendMap = createExtendMap(cssMap);

    console.log("Dragged Selector:", draggedSelector);
    console.log("Target Selector:", targetSelector);

    const draggedStyle = cssMap.get(draggedSelector);
    console.log("Dragged Style:", draggedStyle);

    const targetStyle = cssMap.get(targetSelector);
    console.log("Target Style:", targetStyle);

    if (draggedStyle) {
        // Update the dragged element's selector to reflect its new position
        const draggedElement = getElementFromPath(draggedSelector);
        const newDraggedSelector = generateNewSelector(
            draggedElement,
            targetSelector,
        );
        const tempStyle = draggedStyle;
        console.log("Temp Style:", tempStyle);
        console.log(`Deleting style for ${draggedSelector}`);
        cssMap.delete(draggedSelector);

        console.log(`Updating style for ${newDraggedSelector} to`, tempStyle);
        cssMap.set(newDraggedSelector, tempStyle);

        // Update extendMap if necessary
        updateExtendMap(draggedSelector, newDraggedSelector, extendMap);

        // Recursively update styles for all child elements
        updateChildStyles(draggedElement, newDraggedSelector, extendMap);
    }

    // Ensure the target element's styles are preserved
    if (targetStyle) {
        cssMap.set(targetSelector, targetStyle);
    }
}

function createExtendMap(cssMap) {
    const extendMap = new Map();
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
    return extendMap;
}

function updateExtendMap(oldSelector, newSelector, extendMap) {
    if (extendMap.has(oldSelector)) {
        const value = extendMap.get(oldSelector);
        extendMap.set(newSelector, value);
        extendMap.delete(oldSelector);
        console.log(`Updated extendMap for ${newSelector}`);
    }
}

function updateChildStyles(element, parentSelector, extendMap) {
    const cssMap = global.map.cssMap;
    const children = element.children;

    console.log("Updating child styles...");
    console.log("Parent Element:", element);
    console.log("Parent Selector:", parentSelector);
    console.log("Children:", children);

    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        const oldChildSelector = generateElementCssSelector(child);
        const newChildSelector = `${parentSelector} > ${child.tagName.toLowerCase()}:nth-of-type(${i + 1})`;

        console.log("Child Element:", child);
        console.log("Old Child Selector:", oldChildSelector);
        console.log("New Child Selector:", newChildSelector);

        const childStyle = cssMap.get(oldChildSelector);
        if (childStyle) {
            console.log(`Updating style for ${newChildSelector} to`, childStyle);
            cssMap.set(newChildSelector, childStyle);
            console.log(`Deleting style for ${oldChildSelector}`);
            cssMap.delete(oldChildSelector);
        } else {
            console.log(`No style found for ${oldChildSelector}`);
        }

        // Update extendMap for child elements
        updateExtendMap(oldChildSelector, newChildSelector, extendMap);

        // Recursively update styles for the child's children
        updateChildStyles(child, newChildSelector, extendMap);
    }
}

function generateNewSelector(element, targetSelector) {
    console.log("Generating new selector...");
    console.log("Element:", element);
    console.log("Target Selector:", targetSelector);

    const draggedSelectorPath = getElementPath(element);
    const draggedSelectorParent = draggedSelectorPath
        .split(" > ")
        .slice(0, -1)
        .join(" > ");
    const isSameOrigin = targetSelector === draggedSelectorParent;
    console.log("Is Same Origin:", isSameOrigin);

    const tagName = element.tagName.toLowerCase();
    console.log("Tag Name:", tagName);

    const siblings = Array.from(
        getElementFromPath(targetSelector).children,
    ).filter((sibling) => sibling.tagName.toLowerCase() === tagName);
    console.log("Siblings with the same tag name:", siblings);

    const index = siblings.length + (isSameOrigin ? 0 : 1);
    console.log("Index of the element among siblings:", index);

    const newSelector = `${targetSelector} > ${tagName}:nth-of-type(${index})`;
    console.log("New Selector:", newSelector);

    return newSelector;
}

function generateElementCssSelector(element) {
    console.log("Generating element CSS selector...");
    console.log("Element:", element);
    if (!element) return null;
    const parts = [];
    let currentElement = element;
    while (currentElement.parentElement) {
        const tagName = currentElement.tagName.toLowerCase();
        console.log("Tag Name:", tagName);
        const siblings = Array.from(currentElement.parentElement.children).filter(
            (sibling) => sibling.tagName.toLowerCase() === tagName,
        );
        const index = siblings.indexOf(currentElement) + 1;
        if (notNthEnumerableElements.includes(tagName))
            parts.unshift(tagName);
        else parts.unshift(`${tagName}:nth-of-type(${index})`);
        currentElement = currentElement.parentElement;
    }
    return parts.join(" > ");
}

function update() {
    console.log("Updating the document...");
    const jsonObj = updateJsonObj(); // Update jsonObj before using it
    console.log("Updated JSON Object:", jsonObj);
    const doc = global.id.doc;
    global.map.cssMap.clear();
    generateCssSelector(jsonObj, "", new Map());
    const element = createElementFromJson(jsonObj);
    // global.map.cssMap.set(newElement, "");
    doc.body.replaceWith(element);
    const bodyPath = getElementPath(doc.body);
    updateElementInfo(bodyPath, doc.body);
    //populateAttributeOptions(doc);
}

function updateJsonObj() {
    console.log("Updating JSON object...");
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

    const extendMap = createExtendMap(global.map.cssMap);
    if (extendMap.size > 0) {
        const extended = {};
        for (const [key, value] of extendMap.entries()) {
            extended[key] = value;
        }
        bodyJson = { extended, ...bodyJson };
    }

    console.log("Updated JSON Object:", bodyJson);
    return bodyJson;
}