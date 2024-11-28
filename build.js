const mkdirp = require("mkdirp");
const fs = require("node:fs");
const path = require("node:path");

const cssMap = new Map();
const mediaQueriesMap = new Map();

function generateHtmlFromJson(jsonObj) {
    let html = "";

    if (Object.prototype.hasOwnProperty.call(jsonObj, "element")) {
        const element = jsonObj.element;
        html += `<${element}`;

        if (Object.prototype.hasOwnProperty.call(jsonObj, "class")) {
            html += ` class="${jsonObj.class}"`;
        }

        if (Object.prototype.hasOwnProperty.call(jsonObj, "attributes")) {
            for (const [key, value] of Object.entries(jsonObj.attributes)) {
                html += ` ${key}="${value}"`;
            }
        }

        // Check if the element is a self-closing tag
        if (["img", "br", "hr", "input", "meta", "link"].includes(element)) {
            html += " />";
        } else {
            html += ">";

            if (Object.prototype.hasOwnProperty.call(jsonObj, "text")) {
                const originalText = jsonObj.text;
                if (originalText?.includes("cwrapSpan")) {
                    const parts = originalText.split("cwrapSpan");
                    html += parts[0];
                    for (let i = 1; i < parts.length; i++) {
                        html += `<span data-cwrap-placeholder="true"></span>${parts[i]}`;
                    }
                } else {
                    html += originalText;
                }
            }

            if (Object.prototype.hasOwnProperty.call(jsonObj, "blueprint")) {
                const blueprint = jsonObj.blueprint;
                const count = blueprint.count;
                for (let i = 0; i < count; i++) {
                    let blueprintJson = replacePlaceholdersCwrapIndex(blueprint, i);
                    blueprintJson = replacePlaceholdersCwrapArray(blueprintJson, i);
                    html += generateHtmlFromJson(blueprintJson);
                }
            }

            if (Object.prototype.hasOwnProperty.call(jsonObj, "children")) {
                for (const child of jsonObj.children) {
                    html += generateHtmlFromJson(child);
                }
            }

            html += `</${element}>`;
        }
    }

    return html;
}

let hasCwrapGetParams = false;
function generateHtmlWithScript(jsonObj, jsonFilePath) {
    let html = generateHtmlFromJson(jsonObj);

    // Calculate the depth based on the JSON file's path relative to the routes folder
    const relativePath = path.relative(
        path.join(__dirname, "routes"),
        jsonFilePath,
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
                err,
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

function generateHeadHtml(head, buildDir) {
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

    headHtml += "</head>";
    return headHtml;
}

function processRouteDirectory(routeDir, buildDir) {
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
        headContent = generateHeadHtml(jsonObj.head, buildDir);
    }

    // Generate HTML content from JSON and append the script tag
    const bodyContent = generateHtmlWithScript(jsonObj, jsonFile);

    const webContent = `
<!DOCTYPE html>
<html lang="en">
${headContent}
${bodyContent}
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
        [...mediaQueriesMap.entries()].reverse(),
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
        const scriptDestination = path.join(buildDir, "scripts", "cwrapFunctions.js");
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
        },
    );
    return JSON.parse(replacedString);
}

function replacePlaceholdersCwrapArray(jsonObj, index) {
    const jsonString = JSON.stringify(jsonObj);

    // Find all cwrapArray placeholders
    const arrayMatches = jsonString.match(/cwrapArray\[(.*?)\]/g);
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
            array[index] !== undefined ? array[index] : "",
        );
    }

    return JSON.parse(replacedString);
}

function generateCssSelector(
    jsonObj,
    parentSelector = "",
    siblingCountMap = new Map(),
) {
    // Start with the parent selector
    let selector = parentSelector;

    if (jsonObj.element) {
        const element = jsonObj.element;

        // Initialize sibling count map for the parent selector if not already present
        if (!siblingCountMap.has(parentSelector)) {
            siblingCountMap.set(parentSelector, new Map());
        }
        const parentSiblingCount = siblingCountMap.get(parentSelector);

        // Handle special elements like 'body', 'main', and 'footer'
        if (element === "body" || element === "main" || element === "footer") {
            selector += (parentSelector ? " > " : "") + element;
        } else {
            // Initialize sibling count for the element if not already present
            if (!parentSiblingCount.has(element)) {
                parentSiblingCount.set(element, 0);
            }
            // Increment the sibling count for the element
            parentSiblingCount.set(element, parentSiblingCount.get(element) + 1);

            // Append the element and its nth-of-type pseudo-class to the selector
            selector += ` > ${element}:nth-of-type(${parentSiblingCount.get(
                element,
            )})`;
        }
        // Store the style in the cssMap if present in the JSON object
        if (jsonObj.style?.trim() && jsonObj.customTag !== "cwrapBlueprintCSS") {
            cssMap.set(selector, jsonObj.style);
        }

        // Handle extensions if present in the JSON object
        if (Array.isArray(jsonObj.extend)) {
            for (const extension of jsonObj.extend) {
                // Generate the extended selector
                const extendedSelector = `${selector}${extension.extension}`;
                // Store the extended style in the cssMap
                if (extension.style.trim()) {
                    cssMap.set(extendedSelector, extension.style);
                }
            }
        }

        // Check if the JSON object has media queries
        if (jsonObj.mediaQueries) {
            // Iterate over each media query
            for (const mediaQuery of jsonObj.mediaQueries) {
                // Create a media query selector
                const mediaQuerySelector = `${selector}`;
                // Initialize the media query map if not already present
                if (!mediaQueriesMap.has(mediaQuery.query)) {
                    mediaQueriesMap.set(mediaQuery.query, new Map());
                }
                // Store the media query style in the mediaQueriesMap
                if (mediaQuery.style.trim()) {
                    mediaQueriesMap
                        .get(mediaQuery.query)
                        .set(mediaQuerySelector, mediaQuery.style);
                }
            }
        }

        // Check if the JSON object has children elements
        if (jsonObj.children) {
            // Recursively generate CSS selectors for each child element
            for (const child of jsonObj.children) {
                generateCssSelector(child, selector, siblingCountMap);
            }
        }

        // Handle blueprint property
        if (jsonObj.blueprint) {
            jsonObj.customTag = "cwrapBlueprintCSS";
            const blueprint = jsonObj.blueprint;
            for (let i = 0; i < blueprint.count; i++) {
                const blueprintChild = JSON.parse(JSON.stringify(blueprint));
                blueprintChild.element = blueprint.element;
                blueprintChild.children = blueprint.children;
                //blueprintChild.customTag = "cwrapBlueprintCSS"; //commenting this house fix the issue (not sure why) with the blueprint elements not being added to the cssMap on the first load
                let cookedBLueprintChild = replacePlaceholdersCwrapIndex(
                    blueprintChild,
                    i,
                );
                cookedBLueprintChild = replacePlaceholdersCwrapArray(
                    cookedBLueprintChild,
                    i,
                );

                generateCssSelector(cookedBLueprintChild, selector, siblingCountMap);
            }
        }
    }
}