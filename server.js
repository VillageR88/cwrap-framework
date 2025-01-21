const express = require("express");
const livereload = require("livereload");
const connectLivereload = require("connect-livereload");
const bodyParser = require("body-parser");
const path = require("node:path");
const fs = require("node:fs");
const os = require("node:os");
const { execSync } = require("node:child_process");

const activeParam = process?.argv?.slice(2);
const isDevelopment = activeParam.includes("dev");
if (isDevelopment) console.log("isDevelopment");

const HTTP_PORT = 36969;
let BASE_DIR;
if (os.platform() === "win32") {
  BASE_DIR = path.join(os.homedir(), ".cwrap");
} else if (os.platform() === "darwin") {
  BASE_DIR = path.join(os.homedir(), ".cwrap");
} else {
  BASE_DIR = path.join(os.homedir(), ".cwrap");
}
const ROOT_DIR = path.resolve(__dirname);
const CWRAP_DIR = isDevelopment
  ? path.resolve(__dirname, "dist")
  : path.resolve("node_modules", "cwrap-framework");

let buildErrorOccurred = false;
let isBuilding = false; // To track if a build is in progress
let buildTriggered = false; // To ensure the build only runs once for a series of changes
let debounceTimeout;

// Create and configure the livereload server
const liveReloadServer = livereload.createServer({
  exts: ["json"],
  exclusions: [/dist/],
});
liveReloadServer.watch(ROOT_DIR);

// Debounce function to manage build process queue
const debounceReload = (filePath) => {
  if (filePath.endsWith(".json")) {
    if (isBuilding || buildTriggered) return;
    buildTriggered = true;

    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      isBuilding = true;

      try {
        execSync("node build.js dev", { stdio: "inherit" });
        buildErrorOccurred = false;
        liveReloadServer.refresh("*");
      } catch (err) {
        const errorHtml = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Build Error</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                text-align: center;
                padding: 50px;
              }
              h1 {
                color: red;
              }
              pre {
                text-align: left;
                background-color: #f8f8f8;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 4px;
                overflow-x: auto;
              }
            </style>
          </head>
          <body>
            <h1>Build Error</h1>
            <p>Sorry, something went wrong during the build process. Please try again later.</p>
            <pre>${err.message}\n${err.stack}</pre>
          </body>
          </html>
        `;

        fs.writeFileSync(path.join(ROOT_DIR, "error.html"), errorHtml);
        buildErrorOccurred = true;

        console.log("Build failed. Error page created.");

        liveReloadServer.refresh("*");
      } finally {
        isBuilding = false;
        buildTriggered = false; // Reset the trigger for the next change
      }
    }, 300);
  }
};

liveReloadServer.watcher.on("change", debounceReload);

// Create the Express app
const app = express();

// Middleware to serve the error page if a build error occurred
app.use((req, res, next) => {
  if (buildErrorOccurred) {
    // Serve the error page
    res.sendFile(path.join(ROOT_DIR, "error.html"));
  } else {
    next();
  }
});

// Middleware
app.use(connectLivereload());
app.use(express.static(CWRAP_DIR)); // Serve static files from CWRAP_DIR
app.use(express.static(ROOT_DIR)); // Serve static files from ROOT_DIR
app.use(bodyParser.json()); // Middleware to parse JSON bodies

//removed obsolete api 18.01.2025

// Middleware to serve index.html for any other route
app.get("*", (req, res) => {
  const indexPath = isDevelopment
    ? path.join(ROOT_DIR, "dist", "index.html")
    : path.join(CWRAP_DIR, "index.html");
  res.sendFile(indexPath);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).sendFile(path.join(ROOT_DIR, "error.html"));
});

// Start the server
app.listen(HTTP_PORT, () => {
  console.log(`Server running at http://localhost:${HTTP_PORT}`);
});
