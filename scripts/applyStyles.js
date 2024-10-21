/**
 * @type {import('./_globals.js')}
 */
/**
 * Applies the styles from the cssMap and mediaQueriesMap to preview document (iframe).
 */
export default function applyStyles() {
	const rootMap = global.map.rootMap;
	const fontMap = global.map.fontMap;
	const cssMap = global.map.cssMap;
	const mediaQueriesMap = global.map.mediaQueriesMap;

	let customStyles = "";
	if (fontMap) {
		for (const [_, fonts] of fontMap.entries()) {
			for (const font of fonts) {
				customStyles += "@font-face {\n";
				for (const [property, value] of Object.entries(font)) {
					customStyles += `  ${property}: ${value};\n`;
				}
				customStyles += "}\n";
			}
		}
	}
	if (rootMap) {
		customStyles += ":root {\n";
		rootMap.forEach((value, key) => {
			customStyles += `${key}: ${value};\n`;
		});
		customStyles += "}\n";
	}
	cssMap.forEach((value, key) => {
		customStyles += `${key} {${value}}\n`;
	});

	// customStyles = addCustomClasses(customStyles);

	if (mediaQueriesMap)
		mediaQueriesMap.forEach((styles, query) => {
			customStyles += `@media (${query}) {\n`;
			styles.forEach((value, key) => {
				customStyles += `${key} {${value}}\n`;
			});
			customStyles += "}\n";
		});

	global.id.doc.getElementById("custom-styles").textContent = customStyles;
}

function addCustomClasses(customStyles) {
	let updatedStyles = customStyles;
	updatedStyles += ".cwrap-glowing {\n";
	updatedStyles += "outline: 2px solid red;\n";
	updatedStyles += "outline-offset: -2px;\n";
	updatedStyles += "}\n";
	return updatedStyles;
}
