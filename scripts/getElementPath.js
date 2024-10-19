/**
 * Gets the full path of the element in the DOM tree.
 * It runs inside createElementFromJson.js and loadPreview.js
 * This function runs at the first load to select body element
 * and each time somebody clicks on DOM element on iframe.
 *
 * @param {HTMLElement} element - The DOM element.
 * @returns {string} - The full path of the element.
 */
export default function getElementPath(element) {
  // Initialize an array to store the path segments
  const path = [];
  // Initialize a variable to traverse the DOM tree
  let currentElement = element;

  // Traverse up the DOM tree until the 'body' element is reached
  while (currentElement && currentElement.tagName.toLowerCase() !== "body") {
    // Get the tag name of the element in lowercase
    let tagName = currentElement.tagName.toLowerCase();

    // If the element has an ID, append it to the tag name
    if (currentElement.id) {
      tagName += `#${currentElement.id}`;
    } else {
      // If the element is not a special tag like 'main', 'footer', or 'body'
      if (!["main", "footer", "body"].includes(tagName)) {
        // Initialize sibling index to 1
        let siblingIndex = 1;
        // Get the previous sibling element
        let sibling = currentElement.previousElementSibling;

        // Traverse previous siblings to count elements of the same type
        while (sibling) {
          if (
            sibling.tagName.toLowerCase() ===
            currentElement.tagName.toLowerCase()
          ) {
            siblingIndex++;
          }
          sibling = sibling.previousElementSibling;
        }

        // Append nth-of-type pseudo-class to the tag name
        tagName += `:nth-of-type(${siblingIndex})`;
      }

      // If the element has a class, append it to the tag name
      if (currentElement.className) {
        tagName += `.${currentElement.className.split(" ").join(".")}`;
      }
    }
    // Add the tag name to the beginning of the path array
    path.unshift(tagName);
    // Move to the parent element
    currentElement = currentElement.parentElement;
  }

  // If the element is the 'body', add it to the beginning of the path array
  if (currentElement) {
    path.unshift(currentElement.tagName.toLowerCase());
  }

  // Join the path array into a string with ' > ' as the separator and return it
  // console.log("path.join",path.join(" > "));
  return path.join(" > ").replace(".cwrap-glowing", "");
}
