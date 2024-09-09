// /**
//  * Populates the property select element with all available CSS properties
//  * that are not currently applied to the element specified by the full path.
//  *
//  * @param {string} fullPath - The full path of the element.
//  * @param {Map} cssMap - The map of CSS styles.
//  * @param {Array} cssProperties - The object containing all CSS properties.
//  */
// export default function populatePropertySelectAll(
//     fullPath,
//     cssMap,
//     cssProperties
//   ) {
//     // Get the current style for the full path from the cssMap or set it to an empty string if not found
//     const currentStyle = cssMap.get(fullPath) || "";
//     // Split the current style string into individual properties, filter out empty strings, and trim whitespace
//     const appliedProperties = currentStyle
//       .split(";")
//       .filter(Boolean)
//       .map((prop) => prop.split(":")[0].trim());

//     // Get the property select element by its ID
//     const propertySelectAll = document.getElementById("propertySelectAll");
//     // Clear any existing options in the property select element
//     propertySelectAll.innerHTML = "";

//     // Iterate over each property in the cssProperties object
//     for (const property in cssProperties) {
//       // If the property is not already applied, create a new option element
//       if (!appliedProperties.includes(property)) {
//         const option = document.createElement("option");
//         // Set the value and text content of the option element to the property
//         option.value = property;
//         option.textContent = property;
//         // Append the option element to the property select element
//         propertySelectAll.appendChild(option);
//       }
//     }
//   }

/**
 * Populates the element select all element with sematic HTML elements like div, span, p, etc.
 */
export default function populateElementSelectAll() {
  const elementSelectAll = document.getElementById("elementSelectAll");
  //   elementSelectAll.innerHTML = elementSelect.innerHTML;
  const semanticElements = [
    "a",
    "abbr",
    "address",
    "area",
    "article",
    "aside",
    "audio",
    "b",
    "base",
    "bdi",
    "bdo",
    "blockquote",
    "body",
    "br",
    "button",
    "canvas",
    "caption",
    "cite",
    "code",
    "col",
    "colgroup",
    "data",
    "datalist",
    "dd",
    "del",
    "details",
    "dfn",
    "dialog",
    "div",
    "dl",
    "dt",
    "em",
    "embed",
    "fieldset",
    "figcaption",
    "figure",
    "footer",
    "form",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "head",
    "header",
    "hr",
    "html",
    "i",
    "iframe",
    "img",
    "input",
    "ins",
    "kbd",
    "label",
    "legend",
    "li",
    "link",
    "main",
    "map",
    "mark",
    "meta",
    "meter",
    "nav",
    "noscript",
    "object",
    "ol",
    "optgroup",
    "option",
    "output",
    "p",
    "param",
    "picture",
    "pre",
    "progress",
    "q",
    "rp",
    "rt",
    "ruby",
    "s",
    "samp",
    "script",
    "section",
    "select",
    "slot",
    "small",
    "source",
    "span",
    "strong",
    "style",
    "sub",
    "summary",
    "sup",
    "table",
    "tbody",
    "td",
    "template",
    "textarea",
    "tfoot",
    "th",
    "thead",
    "time",
    "title",
    "tr",
    "track",
    "u",
    "ul",
    "var",
    "video",
    "wbr",
  ];
  //clear any existing options in the element select element before appending new options
  elementSelectAll.innerHTML = "";
  for (const element of semanticElements) {
    const option = document.createElement("option");
    option.value = element;
    option.textContent = element;
    //append the option element to the element select element
    elementSelectAll.appendChild(option);
  }
}
