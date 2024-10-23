const mkdirp = require("mkdirp");
const fs = require("node:fs");
const path = require("node:path");

const cssMap = new Map();
const mediaQueriesMap = new Map();

function generateCssSelector(jsonObj, parentSelector, divCountStack = []) {
	let selector = parentSelector;

	if (Object.prototype.hasOwnProperty.call(jsonObj, "element")) {
		const element = jsonObj.element;

		if (element === "body" || element === "main" || element === "footer") {
			selector += (parentSelector ? " > " : "") + element;
		} else {
			if (element === "div") {
				// Increment the div count for the current level
				const currentLevel = divCountStack.length - 1;
				divCountStack[currentLevel] = (divCountStack[currentLevel] || 0) + 1;
				selector += ` > ${element}:nth-of-type(${divCountStack[currentLevel]})`;
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

		if (Object.prototype.hasOwnProperty.call(jsonObj, "mediaQueries")) {
			for (const mediaQuery of jsonObj.mediaQueries) {
				if (!mediaQueriesMap.has(mediaQuery.query)) {
					mediaQueriesMap.set(mediaQuery.query, new Map());
				}
				const queryMap = mediaQueriesMap.get(mediaQuery.query);
				queryMap.set(selector, mediaQuery.style);
			}
		}

		if (Object.prototype.hasOwnProperty.call(jsonObj, "children")) {
			// Push a new level to the div count stack
			divCountStack.push(0);
			for (const child of jsonObj.children) {
				generateCssSelector(child, selector, divCountStack);
			}
			// Pop the current level from the div count stack
			divCountStack.pop();
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
	console.log(`Copying directory from ${source} to ${destination}`);
	if (!fs.existsSync(destination)) {
		mkdirp.sync(destination);
		console.log(`Created directory ${destination}`);
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

	// Generate HTML content from JSON
	const bodyContent = generateHtmlFromJson(jsonObj);

	const webContent = `
<!DOCTYPE html>
<html lang="en">
${headContent}
<body>
${bodyContent}
</body>
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

	cssMap.forEach((value, key) => {
		cssContent += `${key} {${value}}\n`;
	});

	// Add media queries to CSS content
	mediaQueriesMap.forEach((elementsMap, query) => {
		cssContent += `@media (${query}) {\n`;
		elementsMap.forEach((style, selector) => {
			cssContent += `  ${selector} {${style}}\n`;
		});
		cssContent += "}\n";
	});

	fs.writeFileSync(cssFile, cssContent, "utf8");
	cssMap.clear();
	mediaQueriesMap.clear();
	console.log(`Generated ${cssFile} successfully!`);
}

function processAllRoutes(sourceDir, buildDir) {
	console.log(`Processing all routes in ${sourceDir}`);
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

	// Process the home directory
	processRouteDirectory(routesDir, buildDir);

	// Process all routes
	processAllRoutes(routesDir, buildDir);
}

main();
