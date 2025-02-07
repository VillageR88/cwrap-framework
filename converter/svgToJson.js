const fs = require("node:fs");
const path = require("node:path");
const { parseString, Builder } = require("xml2js");

const svgDir = path.join(__dirname);
const activeParam = process?.argv?.slice(2);
const isStandalone = activeParam.includes("standalone");

const makeUnique = (element, idMap, defsMap) => {
  if (element.$?.id) {
    const newId = `${element.$.id}_${Math.random().toString(36).substr(2, 9)}`;
    idMap[element.$.id] = newId;
    element.$.id = newId;
  }

  if (element.$) {
    for (const attr in element.$) {
      if (element.$[attr].startsWith("url(#")) {
        const id = element.$[attr].slice(5, -1);
        if (defsMap[id]) {
          element.$[attr] = defsMap[id];
        } else if (idMap[id]) {
          element.$[attr] = `url(#${idMap[id]})`;
        }
      }
    }
  }

  for (const key in element) {
    if (Array.isArray(element[key])) {
      for (const child of element[key]) {
        makeUnique(child, idMap, defsMap);
      }
    }
  }
};

const convertElement = (element, elementName) => {
  const converted = {
    element: elementName,
    attributes: element.$ || {},
  };

  if (element._) {
    converted.text = element._;
  }

  if (element.children) {
    converted.children = element.children.map((child) =>
      convertElement(child, child.element)
    );
  } else {
    const childrenElements = Object.keys(element).filter(
      (key) => key !== "$" && key !== "_"
    );
    if (childrenElements.length > 0) {
      converted.children = childrenElements.flatMap((childElementName) => {
        const childElement = element[childElementName];
        if (Array.isArray(childElement)) {
          return childElement.map((child) =>
            convertElement(child, childElementName)
          );
        }
        return [];
      });
    }
  }

  return converted;
};

const convertSvgToJsonWithChildren = (filePath) => {
  const svgContent = fs.readFileSync(filePath, "utf-8");
  parseString(svgContent, (err, result) => {
    if (err) {
      console.error("Error parsing SVG:", err);
      return;
    }

    if (isStandalone) {
      const idMap = {};
      const defsMap = {};

      // Collect definitions
      if (result.svg.defs) {
        for (const def of result.svg.defs) {
          for (const key in def) {
            if (Array.isArray(def[key])) {
              for (const item of def[key]) {
                if (item.$?.id) {
                  defsMap[item.$.id] = item;
                }
              }
            }
          }
        }
      }

      makeUnique(result.svg, idMap, defsMap);
    }

    const convertedJson = convertElement(result.svg, "svg");
    const outputFilePath = path.join(`${path.basename(filePath, ".svg")}.json`);
    fs.writeFileSync(outputFilePath, JSON.stringify(convertedJson, null, 2));
  });
};

fs.readdir(svgDir, (err, files) => {
  if (err) {
    console.error("Error reading directory:", err);
    return;
  }

  const svgFiles = files.filter((file) => path.extname(file) === ".svg");
  for (const file of svgFiles) {
    convertSvgToJsonWithChildren(path.join(svgDir, file));
  }
});
