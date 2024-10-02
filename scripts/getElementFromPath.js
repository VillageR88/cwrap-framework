/**
 * Get the element from the path in the elementSelect input field
 * @param {string} [path] - The path to the element in the preview document.
 */
export default function getElementFromPath(path) {
    // console.log("Function getElementFromPath called with path:", path);

    let selectorLevels;
    if (path) {
        selectorLevels = path.split(">");
    } else {
        selectorLevels = global.id.elementSelect.value.split(">");
    }
    // console.log("Selector levels:", selectorLevels);

    const selectorLevelsAndPosition = [];
    const previewDocument =
        global.id.preview.contentDocument ||
        global.id.preview.contentWindow.document;

    // Parse the selector string into an array of selectors and their positions
    for (const selector of selectorLevels) {
        if (!selector.includes(":nth-of-type")) {
            selectorLevelsAndPosition.push([selector.trim(), 0]);
        } else {
            const match = selector.match(/:nth-of-type\((\d+)\)/);
            if (match) {
                const positionStr = match[1];
                // console.log(`Parsed position string: '${positionStr}' from selector: '${selector}'`);
                const position = Number(positionStr) - 1; // Adjust position to be zero-based
                if (Number.isNaN(position)) {
                    console.error(`Invalid position value: ${positionStr} in selector: ${selector}`);
                    return null;
                }
                selectorLevelsAndPosition.push([
                    selector.split(":nth-of-type")[0].trim(),
                    position,
                ]);
            } else {
                console.error(`Invalid selector format: ${selector}`);
                return null;
            }
        }
    }
    // console.log("Selector levels and position:", selectorLevelsAndPosition);

    // Recursive function to traverse the DOM
    function traverseDOM(element, levels) {
        if (levels.length === 0) {
            return element;
        }

        const [tag, position] = levels[0];
        const remainingLevels = levels.slice(1);
        const matchingElements = Array.from(element.children).filter(child => child.tagName.toLowerCase() === tag.toLowerCase());

        // Debug log: current tag, position, and matching elements
        // console.log(`Traversing tag: ${tag}, position: ${position}`);
        // console.log("Matching elements:", matchingElements);

        // Check if the position is valid
        if (position >= matchingElements.length || position < 0) {
            console.error(`Invalid position: ${position} for tag: ${tag}`);
            return null; // Invalid path
        }

        // Move to the next element in the path
        return traverseDOM(matchingElements[position], remainingLevels);
    }

    // Handle the root element separately
    const currentElement = previewDocument.body;
    // console.log("Current element (body):", currentElement);

    if (selectorLevelsAndPosition[0][0] === "body") {
        selectorLevelsAndPosition.shift(); // Remove the root 'body' element from the levels
    }
    // console.log("Selector levels and position after removing body:", selectorLevelsAndPosition);

    const finalElement = traverseDOM(currentElement, selectorLevelsAndPosition);
    // console.log("Final element:", finalElement);

    return finalElement;
}