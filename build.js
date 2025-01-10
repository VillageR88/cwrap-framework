const mkdirp = require("mkdirp");
const fs = require("fs-extra");
const path = require("node:path");
const { JSDOM } = require("jsdom");
const { document } = new JSDOM().window;

const constMap = new Map();
const cssMap = new Map();
const mediaQueriesMap = new Map();
const notNthEnumerableElements = ["body", "nav", "header", "main", "footer"];

const templatesApiUrl = path.join(__dirname, "routes", "templates.json");
const templatesMap = new Map();
const globalsJsonPath = path.join(__dirname, "routes", "globals.json");

const activeParam = process?.argv?.slice(2);
const isDevelopment = activeParam.includes("dev");

const getNestedValue = (obj, path) => {
  if (!path) return obj; // If no path is provided, return the root object
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
};

const replaceCwrapGlobals = (obj) => {
  if (typeof obj === "string") {
    return obj.replace(/cwrapGlobal\[(.*?)\]/g, (match, p1) => {
      const [rootKey, ...nestedPath] = p1.split("."); // Split the key into root and nested parts
      const rootValue = constMap.get(rootKey); // Get the root value from constMap
      if (rootValue !== undefined) {
        // Handle both simple and nested cases
        return getNestedValue(rootValue, nestedPath.join(".")) || match;
      }
      return match; // Preserve the original if no match is found
    });
  }
  if (Array.isArray(obj)) {
    return obj.map(replaceCwrapGlobals); // Recursively process arrays
  }
  if (typeof obj === "object" && obj !== null) {
    for (const key in obj) {
      obj[key] = replaceCwrapGlobals(obj[key]); // Recursively process objects
    }
  }
  return obj; // Return other types unchanged
};

function clearDocumentByOmit(htmlString) {
  // Create a DOM from the provided HTML string
  const dom = new JSDOM(htmlString);
  const document = dom.window.document;

  // Get all elements in the body
  const elements = document.getElementsByTagName("*");

  // Iterate in reverse order and remove elements containing "cwrapOmit"
  for (let i = elements.length - 1; i >= 0; i--) {
    if (
      elements[i].textContent.includes("cwrapOmit") ||
      elements[i].hasAttribute("data-cwrap-omit")
    ) {
      elements[i].parentNode.removeChild(elements[i]);
    }
  }

  // Return the updated HTML as a string
  return document.body.innerHTML;
}

function clearDocumentByPlaceholder(htmlString) {
  return htmlString.replace(/cwrapPlaceholder/g, "");
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
  // Deep copy jsonObj to ensure immutability
  const jsonObjCopy = JSON.parse(JSON.stringify(jsonObj));
  if (omit.includes(jsonObjCopy["omit-id"])) {
    jsonObjCopy.text = "cwrapOmit";
  }

  let isFragment = false;
  if (jsonObjCopy.element === "cwrap-fragment") isFragment = true;
  if (isFragment) {
    const fragment = document.createDocumentFragment();
    for (const child of jsonObjCopy.children) {
      const childElement = createElementFromJson(
        child,
        isInitialLoad,
        blueprintElementCounter,
        properties,
        omit
      );
      if (childElement) fragment.appendChild(childElement);
    }
    return fragment;
  }

  // Create the element
  const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
  let element;

  if (
    jsonObjCopy.element === "svg" ||
    jsonObjCopy.element === "path" ||
    jsonObjCopy.element === "circle" ||
    jsonObjCopy.element === "g"
  ) {
    element = document.createElementNS(SVG_NAMESPACE, jsonObjCopy.element);
  } else {
    element = document.createElement(jsonObjCopy.element);
  }

  let selectedJsonObj = jsonObjCopy;

  function setJsonObjToEnumItem() {
    for (const enumItem of jsonObjCopy.enum) {
      if (blueprintElementCounter === Number(enumItem.nth)) {
        selectedJsonObj = enumItem;
        return false;
      }
    }
    return true;
  }

  let abandonItem = false;
  switch (jsonObjCopy.alter) {
    case "none":
      break;
    case "partial":
      setJsonObjToEnumItem();
      break;
    case "full":
      abandonItem = setJsonObjToEnumItem();
      break;
  }

  if (!abandonItem) {
    const originalText = selectedJsonObj.text || jsonObjCopy.text;

    element.cwrapText = originalText ?? "";

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

      element.textContent = "";

      for (let i = 0; i < mergedParts.length; i++) {
        const part = mergedParts[i];

        if (part.startsWith("cwrapSpan")) {
          const spanElement = document.createElement("span");
          spanElement.isPlaceholder = true;
          element.isPlaceholderCarrier = true;
          element.appendChild(spanElement);
          element.append(part.replace("cwrapSpan", ""));
        } else if (part.startsWith("cwrapTemplate")) {
          const propMap = new Map(properties);

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
              jsonObjCopy?.omit || omit || []
            ).cloneNode(true);

            clonedTemplateElement.isTemplateElement = true;

            if (jsonObjCopy.element === "cwrap-template") {
              clonedTemplateElement.isTemplateElementAnchor = true;
              clonedTemplateElement.templateElement = templateNameWithProps;
              element = clonedTemplateElement;
              jsonObjCopy.templateName = true;
            } else {
              element.appendChild(clonedTemplateElement);
            }
          }
        } else if (part.includes("cwrapProperty")) {
          let replacedText = originalText;
          const regex = /cwrapProperty\[([^\]=]+)=([^\]]+)\]/g;
          const matches = [...originalText.matchAll(regex)];
          for (const match of matches) {
            const [fullMatch, property, defaultValue] = match;
            const mapValue = properties?.get(property);
            if (mapValue !== "cwrapPlaceholder") {
              replacedText = replacedText.replace(
                fullMatch,
                mapValue || defaultValue
              );
            }
          }
          element.append(replacedText);
        } else {
          element.append(part);
        }
      }
    } else {
      // //This is newest addition to workaround JSDOM preventing from non semantic text inside img (for example)
      if (jsonObjCopy?.text?.includes("cwrapOmit")) {
        element?.setAttribute("data-cwrap-omit", "");
      }
      element.textContent = originalText;
    }

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

  if (jsonObjCopy.blueprint) {
    let count = jsonObjCopy.blueprint.count;
    if (count.includes("cwrapProperty")) {
      const parts = count.split(/(cwrapProperty\[[^\]]+\])/);
      for (let i = 1; i < parts.length; i++) {
        if (parts[i].startsWith("cwrapProperty")) {
          const propertyMatch = parts[i].match(
            /cwrapProperty\[([^\]=]+)=([^\]]+)\]/
          );
          if (propertyMatch) {
            const [property, defaultValue] = propertyMatch.slice(1);
            const mapValue = properties?.get(property);
            count = count.replace(parts[i], mapValue || defaultValue);
          }
        }
      }
    }
    count = Number.parseInt(count, 10);
    for (let i = 0; i < count; i++) {
      let cookedJson = replacePlaceholdersCwrapArray(jsonObjCopy.blueprint, i);
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
    for (const child of jsonObjCopy.children) {
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
        if (childElement) element.appendChild(childElement);
      }
    }
  }

  if (jsonObjCopy.element === "cwrap-template" && jsonObjCopy.passover) {
    const passoverElement = element.querySelector("cwrap-passover");
    if (passoverElement) {
      for (const childJson of jsonObjCopy.passover) {
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

  // Calculate the depth based on the JSON file's path relative to the routes folder
  const relativePath = path.relative(
    path.join(__dirname, "routes"),
    jsonFilePath
  );
  const depth = relativePath.split(/[\\/]/).length - 1;

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
    if (!isDevelopment) console.log(`Created directory ${destination}`);
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
    if (!isDevelopment)
      console.log(`Copied favicon.ico to ${faviconDestination}`);
  } else {
    if (!isDevelopment)
      console.warn(`Warning: Favicon file ${faviconSource} does not exist.`);
  }
}

function generateHeadHtml(head, jsonFile) {
  let headHtml = "<head>\n";
  const prefix = process.env.PAGE_URL;
  if (prefix) {
    if (!isDevelopment) console.log("Prefix: ", prefix);
  }

  // Add title
  if (head.title) {
    headHtml += `<title>${head.title}</title>\n`;
  }

  if (head.base) {
    const base = document.createElement("base");
    for (const [key, value] of Object.entries(head.base)) {
      base.setAttribute(key, value);
    }
    headHtml += `    ${base.outerHTML}\n`;
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

  // Calculate the depth based on the JSON file's path relative to the routes folder
  const relativePath = path.relative(path.join(__dirname, "routes"), jsonFile);
  const depth = relativePath.split(/[\\/]/).length - 1;
  const globalsCssPath = `${"../".repeat(depth)}globals.css`;
  headHtml += `    <link rel="stylesheet" href="${globalsCssPath}">\n`;

  headHtml += "</head>";
  return headHtml;
}

function processDynamicRouteDirectory(routeDir, buildDir) {
  const routeParts = routeDir.split(path.sep);
  const lastPart = routeParts[routeParts.length - 1];
  //console.log("Last part of route:", lastPart);
  if (lastPart.startsWith("[") && lastPart.endsWith("]")) {
    //console.log("Directory in brackets:", lastPart);
  }
  const jsonFilePath = path.join(routeDir, "skeleton.json");
  if (fs.existsSync(jsonFilePath)) {
    const jsonContent = fs.readFileSync(jsonFilePath, "utf8");
    const jsonObj = JSON.parse(jsonContent);
    if (jsonObj.routes) {
      //console.log(jsonObj.routes);
    } else {
      //console.error(`Error: Could not find ${jsonFilePath}`);
    }

    if (jsonObj.routes) {
      for (const [index, routeObj] of jsonObj.routes.entries()) {
        const route = routeObj.route; // Ensure route is a string
        const parentRoute = routeObj.parent;
        const routePath = path.join(routeDir);
        const buildPath = parentRoute
          ? path.join(
              buildDir,
              "..",
              "..",
              parentRoute.toString(),
              route.toString()
            )
          : path.join(buildDir, "..", route.toString());
        processStaticRouteDirectory(routePath, buildPath, index);
      }
    }
  }
}

function processStaticRouteDirectory(routeDir, buildDir, index) {
  const jsonFile = path.join(routeDir, "skeleton.json");
  if (!fs.existsSync(jsonFile)) {
    console.error(`Error: Could not open ${jsonFile} file!`);
    return;
  }
  let jsonObj = JSON.parse(fs.readFileSync(jsonFile, "utf8"));
  if (jsonObj.routes) {
    if (!isDevelopment) console.log("routeFound");
    const findCwrapRouteMatches = (str, cwrapMatch) => {
      const matches = [];
      let bracketCount = 0;
      let startIndex = -1;

      for (let i = 0; i < str.length; i++) {
        if (str.slice(i, i + cwrapMatch.length) === cwrapMatch) {
          if (startIndex === -1) {
            startIndex = i;
          }
        }
        if (str[i] === "[") {
          if (startIndex !== -1) bracketCount++;
        } else if (str[i] === "]") {
          if (startIndex !== -1) bracketCount--;
          if (bracketCount === 0 && startIndex !== -1) {
            matches.push(str.slice(startIndex, i + 1));
            startIndex = -1;
          }
        }
      }

      return matches;
    };

    const jsonString = JSON.stringify(jsonObj);
    const arrayMatches = findCwrapRouteMatches(jsonString, "cwrapRoutes");
    let replacedString = jsonString;

    for (const match of arrayMatches) {
      const arrayContent = match.match(/\[(.*)\]/s)[1];
      const items = arrayContent.split(",");
      replacedString = replacedString.replace(match, items[index] || "");
    }

    jsonObj = JSON.parse(replacedString);
  }

  // Generate CSS selectors and extract styles
  generateCssSelector(jsonObj, "");

  // Generate head content
  let headContent = "";
  let globalsHead = {};
  if (fs.existsSync(globalsJsonPath)) {
    const globalsJson = JSON.parse(fs.readFileSync(globalsJsonPath, "utf8"));
    if (globalsJson?.const) {
      for (const [key, value] of Object.entries(globalsJson.const)) {
        constMap.set(key, value);
      }
    }
    if (globalsJson?.head) {
      globalsHead = globalsJson.head;
    }
  }
  const mergedHead = jsonObj.head
    ? { ...globalsHead, ...jsonObj.head }
    : globalsHead;
  headContent = generateHeadHtml(mergedHead, jsonFile);

  // Generate HTML content from JSON and append the script tag
  const bodyContent = generateHtmlWithScript(
    replaceCwrapGlobals(jsonObj),
    jsonFile
  );
  let bodyHtml = bodyContent.outerHTML;
  bodyHtml = clearDocumentByOmit(bodyHtml);
  bodyHtml = clearDocumentByPlaceholder(bodyHtml);
  bodyHtml = replaceCwrapGlobals(bodyHtml);
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
    if (!isDevelopment) console.log(`Created build directory ${buildDir}`);
  }

  // Write the content to build/index.html
  const webFile = path.join(buildDir, "index.html");
  fs.writeFileSync(webFile, webContent, "utf8");
  if (!isDevelopment) console.log(`Generated ${webFile} successfully!`);

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
      } else if (classItem.type === "id") {
        hashtag = "#";
      } else if (classItem.type === "pseudo:") {
        hashtag = ":";
      } else if (classItem.type === "pseudo::") {
        hashtag = "::";
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

  // Add media queries to CSS content, sorted by max-width from biggest to lowest
  const sortedMediaQueries = [...mediaQueriesMap.entries()].sort((a, b) => {
    const maxWidthA = Number.parseInt(
      a[0].match(/max-width:\s*(\d+)px/)[1],
      10
    );
    const maxWidthB = Number.parseInt(
      b[0].match(/max-width:\s*(\d+)px/)[1],
      10
    );
    return maxWidthB - maxWidthA;
  });

  for (const [query, elementsMap] of sortedMediaQueries) {
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
  if (!isDevelopment) console.log(`Generated ${cssFile} successfully!`);

  // Generate globals.css from globals.json if it exists and if processing the home route
  if (routeDir === path.resolve("routes") && fs.existsSync(globalsJsonPath)) {
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
        } else if (classItem.type === "id") {
          hashtag = "#";
        } else if (classItem.type === "pseudo:") {
          hashtag = ":";
        } else if (classItem.type === "pseudo::") {
          hashtag = "::";
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
    if (!isDevelopment)
      console.log(`Generated ${globalsCssFile} successfully!`);
  }
}

function processAllRoutes(sourceDir, buildDir) {
  if (!isDevelopment)
    if (!isDevelopment) console.log(`Processing all routes in ${sourceDir}`);
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
          processStaticRouteDirectory(sourcePath, destinationPath);
          processDynamicRouteDirectory(sourcePath, destinationPath);
          processAllRoutes(sourcePath, destinationPath);
        }
      });
    }
  });
}

function main() {
  const routesDir = path.resolve("routes");
  const buildDir = isDevelopment ? path.resolve("dist") : path.resolve("build");
  if (!isDevelopment) console.log("Starting build process...");

  // Ensure the build directory exists
  if (!fs.existsSync(buildDir)) {
    mkdirp.sync(buildDir);
    if (!isDevelopment) console.log(`Created build directory ${buildDir}`);
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
      if (!isDevelopment)
        console.log(`Copied cwrapFunctions.js to ${scriptDestination}`);
    } else {
      if (!isDevelopment)
        console.warn(`Warning: Script file ${scriptSource} does not exist.`);
    }
  }

  // Process the home directory
  processStaticRouteDirectory(routesDir, buildDir);

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

  // Function to match the outermost `cwrapArray[...]` while handling nested brackets
  const findCwrapArrayMatches = (str, cwrapMatch) => {
    const matches = [];
    let bracketCount = 0;
    let startIndex = -1;

    for (let i = 0; i < str.length; i++) {
      if (str.slice(i, i + cwrapMatch.length) === cwrapMatch) {
        if (startIndex === -1) {
          startIndex = i;
        }
      }
      if (str[i] === "[") {
        if (startIndex !== -1) bracketCount++;
      } else if (str[i] === "]") {
        if (startIndex !== -1) bracketCount--;
        if (bracketCount === 0 && startIndex !== -1) {
          matches.push(str.slice(startIndex, i + 1));
          startIndex = -1;
        }
      }
    }

    return matches;
  };

  const arrayMatches = findCwrapArrayMatches(jsonString, "cwrapArray");
  if (!arrayMatches.length) {
    return jsonObj;
  }

  // Process each `cwrapArray` placeholder
  let replacedString = jsonString;
  for (const match of arrayMatches) {
    const arrayContent = match.match(/\[(.*)\]/s)[1]; // Extract everything inside the outermost brackets

    // Determine the delimiter
    const delimiter = arrayContent.includes("cwrapBreak") ? "cwrapBreak" : ",";

    const array = arrayContent
      .split(delimiter)
      .map((item) => item.trim().replace(/['"]/g, ""));

    replacedString = replacedString.replace(
      match,
      array[index] !== undefined ? array[index] : ""
    );
  }
  if (isDevelopment)
    try {
      return JSON.parse(replacedString);
    } catch (error) {
      console.log("error", arrayMatches);
      replacedString = replacedString.replace(/cwrapArray/g, "");
      console.log(replacedString);
      return replacedString;
    }
  else return JSON.parse(replacedString);
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

    // Handle cwrap-fragment elements
    if (jsonObj.element === "cwrap-fragment") {
      for (const child of jsonObj.children) {
        generateCssSelector(
          child,
          parentSelector,
          siblingCountMap,
          blueprintCounter,
          new Map(propsMap), // Pass a new copy of propsMap to each child
          passover,
          omit
        );
      }
      return;
    }

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
          const templatePropsMap = new Map(); // Create a new isolated propsMap for each template
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

            for (const [key, value] of propsMap) {
              if (!templatePropsMap.has(key)) {
                templatePropsMap.set(key, value);
              }
            }

            generateCssSelector(
              templateElementCopy,
              selector,
              siblingCountMap,
              blueprintCounter,
              templatePropsMap,
              jsonObj?.passover || passover || [],
              jsonObj?.omit || omit || []
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
          new Map(propsMap), // Pass a new copy of propsMap to each passover element
          passover,
          omit
        );
      }
      return;
    }

    // This is for siblingCountMap not + 1 if cwrapOmit present
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
      const styleParts = jsonObj.style.split(";");
      const filteredStyleParts = styleParts.filter(
        (part) => !part.includes("cwrapOmit")
      );
      jsonObj.style = filteredStyleParts.join(";");

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
        if (extension.style.includes("cwrapProperty")) {
          const parts = extension.style.split(/(cwrapProperty\[[^\]]+\])/);
          for (let i = 1; i < parts.length; i++) {
            if (parts[i].startsWith("cwrapProperty")) {
              const propertyMatch = parts[i].match(
                /cwrapProperty\[([^\]=]+)=([^\]]+)\]/
              );
              if (propertyMatch) {
                const [property, defaultValue] = propertyMatch.slice(1);
                const mapValue = propsMap.get(property);
                extension.style = extension.style.replace(
                  parts[i],
                  mapValue || defaultValue
                );
              }
            }
          }
        }
        const styleParts = extension.style.split(";");
        const filteredStyleParts = styleParts.filter(
          (part) => !part.includes("cwrapOmit")
        );
        extension.style = filteredStyleParts.join(";");
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

        let finalStyle = mediaQuery.style;
        if (mediaQuery.style.includes("cwrapProperty")) {
          const parts = mediaQuery.style.split(/(cwrapProperty\[[^\]]+\])/);
          for (let i = 1; i < parts.length; i++) {
            if (parts[i].startsWith("cwrapProperty")) {
              const propertyMatch = parts[i].match(
                /cwrapProperty\[([^\]=]+)=([^\]]+)\]/
              );
              if (propertyMatch) {
                const [property, defaultValue] = propertyMatch.slice(1);
                const mapValue = propsMap.get(property);
                finalStyle = finalStyle.replace(
                  parts[i],
                  mapValue || defaultValue
                );
              }
            }
          }
        }
        const styleParts = finalStyle.split(";");
        const filteredStyleParts = styleParts.filter(
          (part) => !part.includes("cwrapOmit")
        );
        finalStyle = filteredStyleParts.join(";");
        mediaQueriesMap.get(mediaQuery.query).set(selector, finalStyle);
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
          new Map(propsMap), // Pass a new copy of propsMap to each child
          passover,
          omit
        );
      }
    }

    // Handle blueprints
    if (jsonObj.blueprint) {
      jsonObj.customTag = "cwrapBlueprintCSS";
      const blueprint = jsonObj.blueprint;
      let count = blueprint.count;
      if (count.includes("cwrapProperty")) {
        const parts = count.split(/(cwrapProperty\[[^\]]+\])/);
        for (let i = 1; i < parts.length; i++) {
          if (parts[i].startsWith("cwrapProperty")) {
            const propertyMatch = parts[i].match(
              /cwrapProperty\[([^\]=]+)=([^\]]+)\]/
            );
            if (propertyMatch) {
              const [property, defaultValue] = propertyMatch.slice(1);
              const mapValue = propsMap.get(property);
              count = count.replace(parts[i], mapValue || defaultValue);
            }
          }
        }
      }
      count = Number.parseInt(count, 10);
      for (let i = 0; i < count; i++) {
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
          new Map(propsMap), // Pass a new copy of propsMap to each blueprint child
          passover,
          omit
        );
      }
    }
  }
}
