const mkdirp = require("mkdirp");
const fs = require("node:fs");
const path = require("node:path");
const { JSDOM } = require("jsdom");
const { document } = new JSDOM().window;

const cssMap = new Map();
const mediaQueriesMap = new Map();
const notNthEnumerableElements = ["body", "nav", "header", "main", "footer"];

const templatesApiUrl = path.join(__dirname, "routes", "templates.json");
const templatesMap = new Map();
const globalsJsonPath = path.join(__dirname, "routes", "globals.json");

function clearDocumentByOmit(htmlString) {
  // Create a DOM from the provided HTML string
  const dom = new JSDOM(htmlString);
  const document = dom.window.document;

  // Get all elements in the body
  const elements = document.getElementsByTagName("*");

  // Iterate in reverse order and remove elements containing "cwrapOmit"
  for (let i = elements.length - 1; i >= 0; i--) {
    if (elements[i].textContent.includes("cwrapOmit")) {
      elements[i].parentNode.removeChild(elements[i]);
    }
  }

  // Return the updated HTML as a string
  return document.body.innerHTML;
}

function loadTemplates() {
  if (fs.existsSync(templatesApiUrl)) {
    const templatesJson = JSON.parse(fs.readFileSync(templatesApiUrl, "utf8"));
    templatesMap.clear();
    for (const template of templatesJson) {
      templatesMap.set(template.name, template);
    }
  } else {
    console.warn(`Warning: Templates file ${templatesApiUrl} does not exist.`);
  }
}

loadTemplates();

/**
 * Creates a DOM element from the provided JSON object and adds it to the preview document (iframe).
 *
 * @param {JsonObject} jsonObj - The JSON object representing the element.
 * @param {boolean} [isInitialLoad] - Flag indicating if this is the initial load.
 * @param {number} [blueprintElementCounter]
 * @param {Map} [properties]
 * @returns {HTMLElement} - The created DOM element.
 */
function createElementFromJson(
  jsonObj,
  isInitialLoad = undefined,
  blueprintElementCounter = undefined,
  properties = new Map(), // Ensure properties is always initialized as a Map if not provided
  omit = []
) {
  if (omit.includes(jsonObj["omit-id"])) {
    jsonObj.text = "cwrapOmit";
  }

  // Create the element
  const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
  let element;
  if (
    jsonObj.element === "svg" ||
    jsonObj.element === "path" ||
    jsonObj.element === "circle" ||
    jsonObj.element === "g"
  ) {
    element = document.createElementNS(SVG_NAMESPACE, jsonObj.element);
  } else {
    element = document.createElement(jsonObj.element);
  }

  let selectedJsonObj = jsonObj;

  function setJsonObjToEnumItem() {
    for (const enumItem of jsonObj.enum) {
      if (blueprintElementCounter === Number(enumItem.nth)) {
        selectedJsonObj = enumItem;
        return false;
      }
    }
    return true;
  }

  let abandonItem = false;
  switch (jsonObj.alter) {
    case "none":
      break;
    case "partial":
      setJsonObjToEnumItem();
      break;
    case "full":
      abandonItem = setJsonObjToEnumItem();
      break;
  }
  // Set the element's text content if specified in the JSON object
  if (!abandonItem) {
    const originalText = selectedJsonObj.text || jsonObj.text;
    element.cwrapText = originalText ?? "";

    // Check if the text contains any of the special tags
    if (
      originalText?.includes("cwrapSpan") ||
      originalText?.includes("cwrapTemplate") ||
      originalText?.includes("cwrapProperty")
    ) {
      const parts = originalText.split(
        /(cwrapSpan|cwrapTemplate\[[^\]]*\]|cwrapProperty\[[^\]]*\])/g
      );
      const mergedParts = [];
      let tempPart = "";

      for (let i = 0; i < parts.length; i++) {
        if (parts[i].startsWith("cwrapSpan")) {
          if (tempPart) {
            mergedParts.push(tempPart);
            tempPart = "";
          }
          mergedParts.push(parts[i]);
        } else {
          tempPart += parts[i];
        }
      }
      if (tempPart) {
        mergedParts.push(tempPart);
      }

      // Process each part and handle cwrapSpan, cwrapTemplate, and cwrapProperty tags
      element.textContent = ""; // Clear the initial content before appending processed parts

      for (let i = 0; i < mergedParts.length; i++) {
        const part = mergedParts[i];

        if (part.startsWith("cwrapSpan")) {
          const spanElement = document.createElement("span");
          spanElement.isPlaceholder = true;
          element.isPlaceholderCarrier = true;
          element.appendChild(spanElement);
          element.append(part.replace("cwrapSpan", ""));
        } else if (part.startsWith("cwrapTemplate")) {
          const propMap = new Map(properties); // Create a new Map based on current properties

          const templateNameWithProps = part.match(
            /cwrapTemplate\[([^\]]+)\]/
          )[1];
          const templateName =
            templateNameWithProps.match(/.+(?=\()/)?.[0] ||
            templateNameWithProps;
          const templateProps =
            templateNameWithProps.match(/(?<=\().+(?=\))/)?.[0];

          if (templateProps) {
            const propsArray = templateProps.split(",");
            for (const prop of propsArray) {
              const [key, value] = prop.split("=");
              propMap.set(key, value);
            }
          }

          const templateElement = templatesMap.get(templateName);
          if (templateElement) {
            const clonedTemplateElement = createElementFromJson(
              templateElement,
              undefined,
              undefined,
              propMap,
              jsonObj?.omit || []
            ).cloneNode(true);

            clonedTemplateElement.isTemplateElement = true;

            if (jsonObj.element === "cwrap-template") {
              clonedTemplateElement.isTemplateElementAnchor = true;
              clonedTemplateElement.templateElement = templateNameWithProps;
              element = clonedTemplateElement;
              jsonObj.templateName = true;
            } else {
              element.appendChild(clonedTemplateElement);
            }
          }
        } else if (part.startsWith("cwrapProperty")) {
          const propertyMatch = part.match(
            /cwrapProperty\[([^\]=]+)=([^\]]+)\]/
          );
          if (propertyMatch) {
            const [property, defaultValue] = propertyMatch.slice(1);
            const mapValue = properties?.get(propertyMatch[1]);
            if (mapValue !== "cwrapPlaceholder") {
              element.append(mapValue || defaultValue);
            }
          }
        } else {
          element.append(part);
        }
      }
    } else {
      element.textContent = originalText;
    }

    // Set additional attributes if specified in the JSON object
    if (selectedJsonObj.attributes) {
      for (const [key, value] of Object.entries(selectedJsonObj.attributes)) {
        if (value === "cwrapOmit") continue;
        if (value.includes("cwrapProperty")) {
          const parts = value.split(/(cwrapProperty\[[^\]]+\])/g);
          let finalValue = "";

          for (const part of parts) {
            if (part.startsWith("cwrapProperty")) {
              const propertyMatch = part.match(
                /cwrapProperty\[([^\]=]+)=([^\]]+)\]/
              );
              if (propertyMatch) {
                const [property, defaultValue] = propertyMatch.slice(1);
                const mapValue = properties?.get(property);
                finalValue += mapValue || defaultValue;
              }
            } else {
              finalValue += part;
            }
          }
          element.setAttribute(key, finalValue);
        } else {
          element.setAttribute(key, value);
        }
      }
    }
  }

  if (isInitialLoad && !jsonObj.blueprint) {
    element.customTag = "cwrapPreloaded";
  }

  if (jsonObj.blueprint) {
    const count = jsonObj.blueprint.count;
    for (let i = 0; i < count; i++) {
      let cookedJson = replacePlaceholdersCwrapArray(jsonObj.blueprint, i);
      cookedJson = replacePlaceholdersCwrapIndex(cookedJson, i);
      const blueprintElement = createElementFromJson(
        cookedJson,
        isInitialLoad,
        i + 1,
        properties,
        omit
      );
      const clonedElement = blueprintElement.cloneNode(true);
      clonedElement.customTag = "cwrapBlueprint";
      element.appendChild(clonedElement);
    }
  }

  if (selectedJsonObj.children) {
    let spanIndex = 0;
    const spanElements = element.querySelectorAll("span");
    for (const child of jsonObj.children) {
      const childElement = createElementFromJson(
        child,
        isInitialLoad,
        blueprintElementCounter,
        properties,
        omit
      );
      if (element.isPlaceholderCarrier && spanElements[spanIndex]) {
        spanElements[spanIndex].replaceWith(childElement);
        spanIndex++;
      } else if (!childElement.isOmitted) {
        element.appendChild(childElement);
      }
    }
  }

  if (jsonObj.element === "cwrap-template" && jsonObj.passover) {
    const passoverElement = element.querySelector("cwrap-passover");
    if (passoverElement) {
      for (const childJson of jsonObj.passover) {
        const childElement = createElementFromJson(
          childJson,
          isInitialLoad,
          blueprintElementCounter,
          properties,
          omit
        );
        passoverElement.before(childElement);
      }
      passoverElement.remove();
    }
  }

  return element;
}

let hasCwrapGetParams = false;
function generateHtmlWithScript(jsonObj, jsonFilePath) {
  let html = createElementFromJson(jsonObj);
  console.log(html);

  // Calculate the depth based on the JSON file's path relative to the routes folder
  const relativePath = path.relative(
    path.join(__dirname, "routes"),
    jsonFilePath
  );
  const depth = relativePath.split(path.sep).length - 1;

  // Check if cwrapGetParams is present in the JSON object
  if (JSON.stringify(jsonObj).includes("cwrapGetParams")) {
    hasCwrapGetParams = true;
    const scriptPath = `${"../".repeat(depth)}scripts/cwrapFunctions.js`;
    html += `<script src="${scriptPath}" type="module"></script>`;
  }

  return html;
}

function copyFile(source, destination) {
  if (!source || !destination) {
    console.error(`Invalid source or destination: ${source}, ${destination}`);
    return;
  }
  fs.copyFile(source, destination, (err) => {
    if (err) {
      console.error(
        `Error: Could not copy file ${source} to ${destination}`,
        err
      );
    }
  });
}

function copyDirectory(source, destination) {
  if (!fs.existsSync(destination)) {
    mkdirp.sync(destination);
    console.log(`Created directory ${destination}`);
  }

  fs.readdir(source, (err, files) => {
    if (err) {
      console.error(`Error: Could not open directory ${source}`, err);
      return;
    }

    for (const file of files) {
      const sourcePath = path.join(source, file);
      const destinationPath = path.join(destination, file);

      fs.stat(sourcePath, (err, stats) => {
        if (err) {
          console.error(`Error: Could not stat ${sourcePath}`, err);
          return;
        }

        if (stats.isDirectory()) {
          copyDirectory(sourcePath, destinationPath);
        } else {
          copyFile(sourcePath, destinationPath);
        }
      });
    }
  });
}

function copyFaviconToRoot(buildDir) {
  const faviconSource = path.join("static", "favicon", "favicon.ico");
  const faviconDestination = path.join(buildDir, "favicon.ico");

  if (fs.existsSync(faviconSource)) {
    copyFile(faviconSource, faviconDestination);
    console.log(`Copied favicon.ico to ${faviconDestination}`);
  } else {
    console.warn(`Warning: Favicon file ${faviconSource} does not exist.`);
  }
}

function generateHeadHtml(head, buildDir, depth) {
  let headHtml = "<head>\n";
  const prefix = process.env.PAGE_URL;
  if (prefix) {
    console.log("Prefix: ", prefix);
  } else {
    // const packageJsonPath = path.join(__dirname, "package.json");
    // const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    // const routeName = packageJson.name;
    // const route = buildDir.split(routeName).pop();
    // headHtml += `<base href="${route.replaceAll("\\", "/")}/">\n`;
  }

  // Add title
  if (head.title) {
    headHtml += `<title>${head.title}</title>\n`;
  }

  // Add meta tags
  if (head.link && Array.isArray(head.link)) {
    for (const link of head.link) {
      headHtml += "    <link";
      for (const [key, value] of Object.entries(link)) {
        headHtml += ` ${key}="${value}"`;
      }
      headHtml += ">\n";
    }
  }
  if (head.meta && Array.isArray(head.meta)) {
    for (const meta of head.meta) {
      headHtml += "    <meta";
      for (const [key, value] of Object.entries(meta)) {
        headHtml += ` ${key}="${value}"`;
      }
      headHtml += ">\n";
    }
  }

  // Add additional tags like link
  headHtml += '    <link rel="stylesheet" href="styles.css">\n';

  // Add globals.css with correct relative path
  const globalsCssPath = `${"../".repeat(depth)}globals.css`;
  headHtml += `    <link rel="stylesheet" href="${globalsCssPath}">\n`;

  headHtml += "</head>";
  return headHtml;
}

function processRouteDirectory(routeDir, buildDir) {
  console.log("routeDir", routeDir);
  const jsonFile = path.join(routeDir, "skeleton.json");
  if (!fs.existsSync(jsonFile)) {
    console.error(`Error: Could not open ${jsonFile} file!`);
    return;
  }

  const jsonObj = JSON.parse(fs.readFileSync(jsonFile, "utf8"));

  // Generate CSS selectors and extract styles
  generateCssSelector(jsonObj, "");

  // Generate head content
  let headContent = "";
  if (Object.prototype.hasOwnProperty.call(jsonObj, "head")) {
    let globalsHead = {};
    if (fs.existsSync(globalsJsonPath)) {
      const globalsJson = JSON.parse(fs.readFileSync(globalsJsonPath, "utf8"));
      if (globalsJson.head) {
        globalsHead = globalsJson.head;
      }
    }
    const mergedHead = { ...globalsHead, ...jsonObj.head };
    headContent = generateHeadHtml(mergedHead, buildDir);
  }

  // Generate HTML content from JSON and append the script tag
  const bodyContent = generateHtmlWithScript(jsonObj, jsonFile);
  let bodyHtml = bodyContent.outerHTML;
  bodyHtml = clearDocumentByOmit(bodyHtml);
  const webContent = `
<!DOCTYPE html>
<html lang="en">
${headContent}
<body>${bodyHtml}</body>
</html>
`;

  // Ensure the build directory exists
  if (!fs.existsSync(buildDir)) {
    mkdirp.sync(buildDir);
    console.log(`Created build directory ${buildDir}`);
  }

  // Write the content to build/index.html
  const webFile = path.join(buildDir, "index.html");
  fs.writeFileSync(webFile, webContent, "utf8");
  console.log(`Generated ${webFile} successfully!`);

  // Write the CSS content to build/styles.css
  const cssFile = path.join(buildDir, "styles.css");
  let cssContent = "";

  // Add font-face declarations from JSON
  if (Object.prototype.hasOwnProperty.call(jsonObj, "fonts")) {
    for (const font of jsonObj.fonts) {
      cssContent += `
@font-face {
    font-family: "${font["font-family"]}";
    src: "${font.src}";
    font-display: ${font["font-display"]};
}
`;
    }
  }

  // Add root styles from JSON
  if (Object.prototype.hasOwnProperty.call(jsonObj, "root")) {
    let rootVariables = ":root {\n";
    for (const [key, value] of Object.entries(jsonObj.root)) {
      rootVariables += `${key}: ${value};\n`;
    }
    rootVariables += "}\n";
    cssContent += rootVariables;
  }

  // Add classroom styles from JSON
  if (Object.prototype.hasOwnProperty.call(jsonObj, "classroom")) {
    for (const classItem of jsonObj.classroom) {
      let hashtag = "";
      if (classItem.type === "class") {
        hashtag = ".";
      }
      cssContent += `${hashtag}${classItem.name} {${classItem.style}}\n`;

      // Add media queries for classroom styles
      if (Object.prototype.hasOwnProperty.call(classItem, "mediaQueries")) {
        for (const mediaQuery of classItem.mediaQueries) {
          if (!mediaQueriesMap.has(mediaQuery.query)) {
            mediaQueriesMap.set(mediaQuery.query, new Map());
          }
          const queryMap = mediaQueriesMap.get(mediaQuery.query);
          queryMap.set(`${hashtag}${classItem.name}`, mediaQuery.style);
        }
      }
    }
  }

  cssMap.forEach((value, key) => {
    if (value.trim()) {
      cssContent += `${key} {${value}}\n`;
    }
  });

  // Add media queries to CSS content
  const reversedMediaQueriesMap = new Map(
    [...mediaQueriesMap.entries()].reverse()
  );

  for (const [query, elementsMap] of reversedMediaQueriesMap) {
    cssContent += `@media (${query}) {\n`;
    elementsMap.forEach((style, selector) => {
      if (style.trim()) {
        cssContent += `  ${selector} {${style}}\n`;
      }
    });
    cssContent += "}\n";
  }

  fs.writeFileSync(cssFile, cssContent, "utf8");
  cssMap.clear();
  mediaQueriesMap.clear();
  console.log(`Generated ${cssFile} successfully!`);

  // Generate globals.css from globals.json if it exists
  if (fs.existsSync(globalsJsonPath)) {
    const globalsJson = JSON.parse(fs.readFileSync(globalsJsonPath, "utf8"));
    let globalsCssContent = "";

    // Add font-face declarations from globals JSON
    if (Object.prototype.hasOwnProperty.call(globalsJson, "fonts")) {
      for (const font of globalsJson.fonts) {
        globalsCssContent += `
@font-face {
    font-family: "${font["font-family"]}";
    src: "${font.src}";
    font-display: ${font["font-display"]};
}
`;
      }
    }

    // Add root styles from globals JSON
    if (Object.prototype.hasOwnProperty.call(globalsJson, "root")) {
      let rootVariables = ":root {\n";
      for (const [key, value] of Object.entries(globalsJson.root)) {
        rootVariables += `${key}: ${value};\n`;
      }
      rootVariables += "}\n";
      globalsCssContent += rootVariables;
    }

    // Add classroom styles from globals JSON
    if (Object.prototype.hasOwnProperty.call(globalsJson, "classroom")) {
      for (const classItem of globalsJson.classroom) {
        let hashtag = "";
        if (classItem.type === "class") {
          hashtag = ".";
        }
        globalsCssContent += `${hashtag}${classItem.name} {${classItem.style}}\n`;

        // Add media queries for classroom styles
        if (Object.prototype.hasOwnProperty.call(classItem, "mediaQueries")) {
          for (const mediaQuery of classItem.mediaQueries) {
            if (!mediaQueriesMap.has(mediaQuery.query)) {
              mediaQueriesMap.set(mediaQuery.query, new Map());
            }
            const queryMap = mediaQueriesMap.get(mediaQuery.query);
            queryMap.set(`${hashtag}${classItem.name}`, mediaQuery.style);
          }
        }
      }
    }

    // Add media queries to globals CSS content
    const reversedMediaQueriesMap = new Map(
      [...mediaQueriesMap.entries()].reverse()
    );

    for (const [query, elementsMap] of reversedMediaQueriesMap) {
      globalsCssContent += `@media (${query}) {\n`;
      elementsMap.forEach((style, selector) => {
        if (style.trim()) {
          globalsCssContent += `  ${selector} {${style}}\n`;
        }
      });
      globalsCssContent += "}\n";
    }

    const globalsCssFile = path.join(buildDir, "globals.css");
    fs.writeFileSync(globalsCssFile, globalsCssContent, "utf8");
    console.log(`Generated ${globalsCssFile} successfully!`);
  }
}

function processAllRoutes(sourceDir, buildDir) {
  console.log(`Processing all routes in ${sourceDir}`);
  fs.readdir(sourceDir, (err, files) => {
    if (err) {
      console.error(`Error: Could not open directory ${sourceDir}`, err);
      return;
    }

    for (const file of files) {
      const sourcePath = path.join(sourceDir, file);
      const destinationPath = path.join(buildDir, file);

      fs.stat(sourcePath, (err, stats) => {
        if (err) {
          console.error(`Error: Could not stat ${sourcePath}`, err);
          return;
        }

        if (stats.isDirectory()) {
          processRouteDirectory(sourcePath, destinationPath);
          processAllRoutes(sourcePath, destinationPath);
        }
      });
    }
  });
}

function main() {
  const routesDir = path.resolve("routes");
  const buildDir = path.resolve("build");

  console.log("Starting build process...");

  // Ensure the build directory exists
  if (!fs.existsSync(buildDir)) {
    mkdirp.sync(buildDir);
    console.log(`Created build directory ${buildDir}`);
  }

  // Copy the static folder to the build directory if it exists
  const staticDir = path.join("static");
  if (fs.existsSync(staticDir)) {
    copyDirectory(staticDir, path.join(buildDir, "static"));
  } else {
    console.warn(`Warning: Static directory ${staticDir} does not exist.`);
  }

  // Copy favicon.ico to the root of the build directory
  copyFaviconToRoot(buildDir);

  // Copy cwrapFunctions.js to the build directory
  if (hasCwrapGetParams) {
    const scriptSource = path.join("scripts", "cwrapFunctions.js");
    const scriptDestination = path.join(
      buildDir,
      "scripts",
      "cwrapFunctions.js"
    );
    if (fs.existsSync(scriptSource)) {
      mkdirp.sync(path.join(buildDir, "scripts"));
      copyFile(scriptSource, scriptDestination);
      console.log(`Copied cwrapFunctions.js to ${scriptDestination}`);
    } else {
      console.warn(`Warning: Script file ${scriptSource} does not exist.`);
    }
  }

  // Process the home directory
  processRouteDirectory(routesDir, buildDir);

  // Process all routes
  processAllRoutes(routesDir, buildDir);
}

main();

// functions hard modified from export to use in node.js environment
function replacePlaceholdersCwrapIndex(jsonObj, index) {
  const jsonString = JSON.stringify(jsonObj);
  const replacedString = jsonString.replace(
    new RegExp(`${"cwrapIndex"}(\\+\\d+)?`, "g"),
    (match) => {
      if (match === "cwrapIndex") {
        return index;
      }
      const offset = Number.parseInt(match.replace("cwrapIndex", ""), 10);
      return index + offset;
    }
  );
  return JSON.parse(replacedString);
}

function replacePlaceholdersCwrapArray(jsonObj, index) {
  const jsonString = JSON.stringify(jsonObj);

  const arrayMatches = jsonString.match(/cwrapArray\[[^\[\]]*\]/g);
  if (!arrayMatches) {
    return jsonObj;
  }

  // Process each cwrapArray placeholder
  let replacedString = jsonString;
  for (const match of arrayMatches) {
    const arrayString = match.match(/\[(.*?)\]/)[1];
    const array = arrayString
      .split(",")
      .map((item) => item.trim().replace(/['"]/g, ""));
    replacedString = replacedString.replace(
      match,
      array[index] !== undefined ? array[index] : ""
    );
  }

  return JSON.parse(replacedString);
}
/**
 * Creates cssMap and mediaQueriesMap.
 * Generates a CSS selector string based on the provided JSON object with example outcome: "body > main> div:nth-of-type(1)"
 * @param {JsonObject} jsonObj - The JSON object representing the element.
 * @param {string} [parentSelector=""] - The CSS selector of the parent element.
 * @param {Map} [siblingCountMap=new Map()] - A Map to keep track of sibling elements count.
 * @param {number} [blueprintCounter]
 * @param {Map} [propsMap=new Map()] - A Map to keep track of properties.
 * @param {JsonObject[]} [passover] - The passover elements to insert.
 * @param {string[]} [omit] - The omit elements to exclude.
 */
function generateCssSelector(
  jsonObj,
  parentSelector = "",
  siblingCountMap = new Map(),
  blueprintCounter = undefined,
  propsMap = new Map(),
  passover = [],
  omit = []
) {
  let selector = parentSelector;

  if (jsonObj.element) {
    if (omit.includes(jsonObj["omit-id"])) {
      return;
    }
    const element = jsonObj.element;
    if (!jsonObj.text) jsonObj.text = "";

    // Handle cwrap-template elements
    if (element === "cwrap-template") {
      const parts = jsonObj.text.split(/(cwrapTemplate\[[^\]]+\])/);
      for (let i = 1; i < parts.length; i++) {
        if (parts[i].startsWith("cwrapTemplate")) {
          const templateNameWithProps = parts[i].match(
            /cwrapTemplate\[([^\]]+)\]/
          )[1];
          const templateName =
            templateNameWithProps.match(/.+(?=\()/)?.[0] ||
            templateNameWithProps;
          const templatePropsMap = propsMap;
          const propsMatch = templateNameWithProps.match(/\(([^)]+)\)/);

          if (propsMatch) {
            const props = propsMatch[1].split(",");
            for (const prop of props) {
              const [key, value] = prop.split("=");
              templatePropsMap.set(key.trim(), value.trim());
            }
          }

          const templateElement = templatesMap.get(templateName);
          if (templateElement) {
            // Create a deep copy of the template element
            const templateElementCopy = JSON.parse(
              JSON.stringify(templateElement)
            );
            for (const [key, value] of templatePropsMap) {
              if (propsMap.has(key)) {
                templatePropsMap.set(key, propsMap.get(key));
              }
            }

            generateCssSelector(
              templateElementCopy,
              selector,
              siblingCountMap,
              blueprintCounter,
              templatePropsMap,
              jsonObj.passover || [],
              jsonObj?.omit || []
            );
          }
          return;
        }
      }
    }

    // Handle cwrap-passover elements
    if (element === "cwrap-passover") {
      for (const childJson of passover) {
        generateCssSelector(
          childJson,
          parentSelector,
          siblingCountMap,
          blueprintCounter,
          propsMap,
          passover,
          omit
        );
      }
      return;
    }

    // Initialize sibling counts for the parent selector
    if (!siblingCountMap.has(parentSelector)) {
      siblingCountMap.set(parentSelector, new Map());
    }
    const parentSiblingCount = siblingCountMap.get(parentSelector);

    if (notNthEnumerableElements.includes(element)) {
      selector += (parentSelector ? " > " : "") + element;
    } else {
      if (!parentSiblingCount.has(element)) {
        parentSiblingCount.set(element, 0);
      }
      parentSiblingCount.set(element, parentSiblingCount.get(element) + 1);
      selector += ` > ${element}:nth-of-type(${parentSiblingCount.get(
        element
      )})`;
    }

    if (jsonObj.text) {
      if (jsonObj.text.includes("cwrapProperty")) {
        const parts = jsonObj.text.split(/(cwrapProperty\[[^\]]+\])/);
        for (let i = 1; i < parts.length; i++) {
          if (parts[i].startsWith("cwrapProperty")) {
            const propertyMatch = parts[i].match(
              /cwrapProperty\[([^\]=]+)=([^\]]+)\]/
            );
            if (propertyMatch) {
              const [property, defaultValue] = propertyMatch.slice(1);
              const mapValue = propsMap.get(property);
              if (mapValue?.includes("cwrapOmit")) {
                return;
              }
            }
          }
        }
      }
    }

    // Handle styles with cwrapProperty
    if (jsonObj.style) {
      if (jsonObj.style.includes("cwrapProperty")) {
        const parts = jsonObj.style.split(/(cwrapProperty\[[^\]]+\])/);
        for (let i = 1; i < parts.length; i++) {
          if (parts[i].startsWith("cwrapProperty")) {
            const propertyMatch = parts[i].match(
              /cwrapProperty\[([^\]=]+)=([^\]]+)\]/
            );
            if (propertyMatch) {
              const [property, defaultValue] = propertyMatch.slice(1);
              const mapValue = propsMap.get(property);
              jsonObj.style = jsonObj.style.replace(
                parts[i],
                mapValue || defaultValue
              );
            }
          }
        }
      }

      // Check if the final style contains cwrapOmit
      if (jsonObj.style.includes("cwrapOmit")) {
        return;
      }

      if (
        jsonObj.enum?.[blueprintCounter - 1]?.style &&
        jsonObj.alter !== "none"
      ) {
        cssMap.set(selector, jsonObj.enum[blueprintCounter - 1].style);
      } else {
        cssMap.set(selector, jsonObj.style);
      }
    } else {
      cssMap.set(selector, "");
    }

    // Handle extensions
    if (jsonObj.extend) {
      for (const extension of jsonObj.extend) {
        const extendedSelector = `${selector}${extension.extension}`;
        cssMap.set(extendedSelector, extension.style);
      }
    }

    // Handle media queries
    if (jsonObj.mediaQueries) {
      for (const mediaQuery of jsonObj.mediaQueries) {
        if (!mediaQueriesMap.has(mediaQuery.query)) {
          mediaQueriesMap.set(mediaQuery.query, new Map());
        }
        mediaQueriesMap.get(mediaQuery.query).set(selector, mediaQuery.style);
      }
    }

    // Recursively process children
    if (jsonObj.children) {
      for (const child of jsonObj.children) {
        generateCssSelector(
          child,
          selector,
          siblingCountMap,
          blueprintCounter,
          propsMap,
          passover,
          omit
        );
      }
    }

    // Handle blueprints
    if (jsonObj.blueprint) {
      jsonObj.customTag = "cwrapBlueprintCSS";
      const blueprint = jsonObj.blueprint;
      for (let i = 0; i < blueprint.count; i++) {
        const blueprintChild = JSON.parse(JSON.stringify(blueprint));
        blueprintChild.element = blueprint.element;
        blueprintChild.children = blueprint.children;
        const cookedBlueprintChild = replacePlaceholdersCwrapArray(
          replacePlaceholdersCwrapIndex(blueprintChild, i),
          i
        );
        generateCssSelector(
          cookedBlueprintChild,
          selector,
          siblingCountMap,
          i + 1,
          propsMap,
          passover,
          omit
        );
      }
    }
  }
}
