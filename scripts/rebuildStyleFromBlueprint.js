import getElementFromPath from "./getElementFromPath.js";
import getElementPath from "./getElementPath.js";
import {
	replacePlaceholdersCwrapArray,
	replacePlaceholdersCwrapIndex,
} from "./replaceBlueprintJsonPlaceholders.js";

/**
 * Rebuilds the styles from the blueprint.
 * @todo I don't appreciate how this function works. I have issue with recursive cut off method of leftovers that shouldn't be applied to styles. This function after update also requires further monitoring of overall impact on code.
 */
export default function rebuildStyleFromBlueprint() {
	const blueprintMap = global.map.blueprintMap;
	const currentElement = getElementFromPath();
	const selector = currentElement.timeStamp;
	const currentMap = blueprintMap.get(selector);
	if (currentMap) {
		rebuildBlueprintCssSelectorFromBlueprint(
			currentMap,
			getElementPath(currentElement),
			new Map(),
		);
	}
}
/**
 * Generates a CSS selector string based on the provided JSON object.
 * @param {JsonObject} jsonObj - The JSON object representing the element.
 * @param {string} [parentSelector=""] - The CSS selector of the parent element.
 * @param {Map} [siblingCountMap=new Map()] - A Map to keep track of sibling elements count.
 */
function rebuildBlueprintCssSelectorFromBlueprint(
	jsonObj,
	parentSelector = "",
	siblingCountMap = new Map(),
	blueprintCounter = undefined,
) {
	const cssMap = global.map.cssMap;
	const mediaQueriesMap = global.map.mediaQueriesMap;
	let selector = parentSelector;

	if (jsonObj.element) {
		console.log(jsonObj.element);
		const element = jsonObj.element;

		if (!siblingCountMap.has(parentSelector)) {
			siblingCountMap.set(parentSelector, new Map());
		}
		const parentSiblingCount = siblingCountMap.get(parentSelector);

		if (element === "body" || element === "main" || element === "footer") {
			selector += (parentSelector ? " > " : "") + element;
		} else {
			if (!parentSiblingCount.has(element)) {
				parentSiblingCount.set(element, 0);
			}
			parentSiblingCount.set(element, parentSiblingCount.get(element) + 1);

			selector += ` > ${element}:nth-of-type(${parentSiblingCount.get(element)})`;
		}
		if (blueprintCounter) {
			if (
				jsonObj.enum?.[blueprintCounter - 1]?.style &&
				jsonObj.alter !== "none"
			) {
				cssMap.set(selector, jsonObj.enum[blueprintCounter - 1]?.style);
			} else if (jsonObj.style && jsonObj.customTag !== "cwrapBlueprintCSS") {
				let cookedObj = replacePlaceholdersCwrapIndex(jsonObj, 0);
				cookedObj = replacePlaceholdersCwrapArray(cookedObj, 0);
				cssMap.set(selector, cookedObj.style);
			} else {
				cssMap.set(selector, "");
			}

			if (jsonObj.mediaQueries) {
				for (const mediaQuery of jsonObj.mediaQueries) {
					const mediaQuerySelector = `${selector}`;
					if (!mediaQueriesMap.has(mediaQuery.query)) {
						mediaQueriesMap.set(mediaQuery.query, new Map());
					}
					mediaQueriesMap
						.get(mediaQuery.query)
						.set(mediaQuerySelector, mediaQuery.style);
				}
			}
		}

		if (jsonObj.count) {
			parentSiblingCount.set(element, 0);
			for (let i = 0; i < Number.parseInt(jsonObj.count, 10); i++) {
				const { count, ...clonedJsonObj } = JSON.parse(JSON.stringify(jsonObj));
				let cookedObj = replacePlaceholdersCwrapIndex(clonedJsonObj, i);
				cookedObj = replacePlaceholdersCwrapArray(cookedObj, i);
				rebuildBlueprintCssSelectorFromBlueprint(
					cookedObj,
					parentSelector,
					siblingCountMap,
					i + 1,
				);
			}
		}

		if (jsonObj.children) {
			for (const child of jsonObj.children) {
				rebuildBlueprintCssSelectorFromBlueprint(
					child,
					selector,
					siblingCountMap,
					blueprintCounter,
				);
			}
		}

		if (jsonObj.extend) {
			for (const extension of jsonObj.extend) {
				const cookedObj = replacePlaceholdersCwrapArray(
					replacePlaceholdersCwrapIndex(extension, 0),
					0,
				);
				const extendedSelector = `${selector}${cookedObj.extension}`;
				cssMap.set(extendedSelector, cookedObj.style);
			}
		}
	}
	console.log(selector);
	console.log(blueprintCounter);
}
