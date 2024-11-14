/**
 * @type {import('./_globals.js')}
 */
/**
 * Applies the styles from the cssMap and mediaQueriesMap to preview document (iframe).
 */
export default function applyStyles() {
  const rootMap = global.map.rootMap;
  const fontMap = global.map.fontMap;
  const classroomMap = global.map.classroomMap;
  const cssMap = global.map.cssMap;
  const mediaQueriesMap = global.map.mediaQueriesMap;

  let customStyles = "";
  const mediaQueries = {};

  if (classroomMap) {
    classroomMap.forEach((value, key) => {
      let hashtag = "";
      if (value.type === "class") {
        hashtag = ".";
      } else if (value.type === "id") {
        hashtag = "#";
      } else if (value.type === "pseudo:") {
        hashtag = ":";
      } else if (value.type === "pseudo::") {
        hashtag = "::";
      }

      if (value.style) {
        customStyles += `${hashtag}${value.name} {${value.style}}\n`;
      }

      if (value.mediaQueries) {
        for (const mediaQuery of value.mediaQueries) {
          if (!mediaQueries[mediaQuery.query]) {
            mediaQueries[mediaQuery.query] = "";
          }
          mediaQueries[
            mediaQuery.query
          ] += `${hashtag}${value.name} {${mediaQuery.style}}\n`;
        }
      }
    });
  }

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
    //type of value is object or string
    cssMap.forEach((value, key) => {
      customStyles += `${key} {${value}}\n`;
    });
  });

  // customStyles = addCustomClasses(customStyles);

  if (mediaQueriesMap) {
    mediaQueriesMap.forEach((styles, query) => {
      if (!mediaQueries[query]) {
        mediaQueries[query] = "";
      }
      styles.forEach((value, key) => {
        mediaQueries[query] += `${key} {${value}}\n`;
      });
    });
  }

  // Append collected media queries at the end
  for (const [query, styles] of Object.entries(mediaQueries)) {
    customStyles += `@media (${query}) {\n${styles}}\n`;
  }

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
