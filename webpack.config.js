const path = require("node:path");
const fs = require("node:fs");

const activeParam = process?.argv?.slice(2);
const isDevelopment = activeParam.includes("development");
console.log("isDevelopment", isDevelopment, activeParam);

const scriptsDir = path.resolve(
  __dirname,
  isDevelopment ? "dist/static/scripts" : "build/static/scripts"
);
const bundleDir = path.resolve(scriptsDir);
const entry = {};

// Ensure the scripts directory exists
if (!fs.existsSync(scriptsDir)) {
  fs.mkdirSync(scriptsDir, { recursive: true });
}

for (const file of fs.readdirSync(scriptsDir)) {
  if (file.endsWith(".js") && !file.startsWith("bundle")) {
    const name = path.basename(file, ".js");
    entry[name] = path.join(scriptsDir, file);
  }
}

module.exports = {
  entry,
  output: {
    filename: "[name].js", // Keep the original name
    path: bundleDir, // Output in the scripts directory
  },
  resolve: {
    extensions: [".js"],
  },
  mode: isDevelopment ? "development" : "production",
};
