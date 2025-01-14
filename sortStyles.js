const fs = require("node:fs");
const path = require("node:path");

const directoryPath = path.join(process.cwd(), "routes");

function sortStyles(obj) {
  if (typeof obj !== "object" || obj === null) {
    return;
  }

  for (const key in obj) {
    if (key === "style" && typeof obj[key] === "string") {
      // Check if the style contains keyframe percentages or braces
      const bracesPattern = /{.*}/;
      if (!bracesPattern.test(obj[key])) {
        const styles = obj[key]
          .split(";")
          .filter(Boolean)
          .map((style) => style.trim().replace(/\s*:\s*/g, ": "))
          .sort((a, b) => {
            const [aKey] = a.split(":");
            const [bKey] = b.split(":");
            return aKey.localeCompare(bKey) || a.localeCompare(b);
          });
        obj[key] = `${styles.join("; ")};`;
      }
    } else if (typeof obj[key] === "object") {
      sortStyles(obj[key]);
    } else if (Array.isArray(obj[key])) {
      obj[key].forEach(sortStyles);
    }
  }
}

function processFile(filePath) {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }

    let json;
    try {
      json = JSON.parse(data);
    } catch (parseErr) {
      console.error("Error parsing JSON:", parseErr);
      return;
    }

    sortStyles(json);

    const sortedJson = JSON.stringify(json, null, 2);
    fs.writeFile(filePath, sortedJson, "utf8", (err) => {
      if (err) {
        console.error("Error writing file:", err);
        return;
      }
      console.log(`Styles sorted successfully in ${filePath}`);
    });
  });
}

function traverseDirectory(directory) {
  fs.readdir(directory, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }

    for (const file of files) {
      const filePath = path.join(directory, file.name);
      if (file.isDirectory()) {
        traverseDirectory(filePath);
      } else if (
        file.isFile() &&
        (file.name === "skeleton.json" || file.name === "globals.json")
      ) {
        processFile(filePath);
      }
    }
  });
}

traverseDirectory(directoryPath);
