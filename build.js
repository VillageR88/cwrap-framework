const fs = require("node:fs");
const path = require("node:path");
const mkdirp = require("mkdirp");

const cssMap = new Map();
let divCount = 0;

function generateCssSelector(jsonObj, parentSelector) {
	let selector = parentSelector;

	if (Object.prototype.hasOwnProperty.call(jsonObj, "element")) {
		const element = jsonObj.element;

		if (element === "body" || element === "main" || element === "footer") {
			selector += (parentSelector ? " > " : "") + element;
		} else {
			if (element === "div") {
				divCount++;
				selector += ` > ${element}:nth-of-type(${divCount})`;
			} else {
				selector += ` > ${element}`;
			}
		}

		if (Object.prototype.hasOwnProperty.call(jsonObj, "class")) {
			selector += `.${jsonObj.class}`;
		}

		if (Object.prototype.hasOwnProperty.call(jsonObj, "style")) {
			cssMap.set(selector, jsonObj.style);
		}

		if (Object.prototype.hasOwnProperty.call(jsonObj, "extend")) {
			for (const extension of jsonObj.extend) {
				const extendedSelector = `${selector}${extension.extension}`;
				cssMap.set(extendedSelector, extension.style);
			}
		}

		if (Object.prototype.hasOwnProperty.call(jsonObj, "children")) {
			for (const child of jsonObj.children) {
				generateCssSelector(child, selector);
			}
		}
	}

	return selector;
}

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
				html += jsonObj.text;
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

function copyFile(source, destination) {
	fs.copyFile(source, destination, (err) => {
		if (err) {
			console.error(`Error: Could not copy file ${source} to ${destination}`);
		}
	});
}

function copyDirectory(source, destination) {
	if (!fs.existsSync(destination)) {
		mkdirp.sync(destination);
	}

	fs.readdir(source, (err, files) => {
		if (err) {
			console.error(`Error: Could not open directory ${source}`);
			return;
		}

		for (const file of files) {
			const sourcePath = path.join(source, file);
			const destinationPath = path.join(destination, file);

			fs.stat(sourcePath, (err, stats) => {
				if (err) {
					console.error(`Error: Could not stat ${sourcePath}`);
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

function processRouteDirectory(routeDir, buildDir) {
	const jsonFile = path.join(routeDir, "skeleton.json");
	if (!fs.existsSync(jsonFile)) {
		console.error(`Error: Could not open ${jsonFile} file!`);
		return;
	}

	const jsonObj = JSON.parse(fs.readFileSync(jsonFile, "utf8"));

	// Generate CSS selectors and extract styles
	generateCssSelector(jsonObj, "");

	// Generate HTML content from JSON
	const bodyContent = generateHtmlFromJson(jsonObj);

	// Create the content for index.html
	const webContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Title Placeholder</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
${bodyContent}
</body>
</html>
`;

	// Ensure the build directory exists
	if (!fs.existsSync(buildDir)) {
		mkdirp.sync(buildDir);
	}

	// Write the content to build/index.html
	const webFile = path.join(buildDir, "index.html");
	fs.writeFileSync(webFile, webContent, "utf8");

	// Write the CSS content to build/styles.css
	const cssFile = path.join(buildDir, "styles.css");
	let cssContent = "";

	// Add font-face declarations from JSON
	if (Object.prototype.hasOwnProperty.call(jsonObj, "fonts")) {
		for (const font of jsonObj.fonts) {
			cssContent += `
@font-face {
    font-family: "${font["font-family"]}";
    src: ${font.src};
    font-display: ${font["font-display"]};
}
`;
		}
	}

	cssMap.forEach((value, key) => {
		cssContent += `${key} {${value}}\n`;
	});
	fs.writeFileSync(cssFile, cssContent, "utf8");

	// Copy the static folder to the build directory if it exists
	const staticDir = path.join("static");
	if (fs.existsSync(staticDir)) {
		copyDirectory(staticDir, path.join(buildDir, "static"));
	} else {
		console.warn(`Warning: Static directory ${staticDir} does not exist.`);
	}

	console.log(`Generated ${webFile} and ${cssFile} successfully!`);
}

function processAllRoutes(sourceDir, buildDir) {
	fs.readdir(sourceDir, (err, files) => {
		if (err) {
			console.error(`Error: Could not open directory ${sourceDir}`);
			return;
		}

		for (const file of files) {
			const sourcePath = path.join(sourceDir, file);
			const destinationPath = path.join(buildDir, file);

			fs.stat(sourcePath, (err, stats) => {
				if (err) {
					console.error(`Error: Could not stat ${sourcePath}`);
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
	const routesDir = "routes";
	const buildDir = "build";

	// Ensure the build directory exists
	if (!fs.existsSync(buildDir)) {
		mkdirp.sync(buildDir);
	}

	// Process the home directory
	processRouteDirectory(routesDir, buildDir);

	// Process all routes
	processAllRoutes(routesDir, buildDir);
}

main();
