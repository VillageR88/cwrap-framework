const express = require("express");
const livereload = require("livereload");
const connectLivereload = require("connect-livereload");
const bodyParser = require("body-parser");
const path = require("node:path");
const fs = require("node:fs");
const os = require("node:os");
const { exec } = require("node:child_process");

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

// Create and configure the livereload server
const liveReloadServer = livereload.createServer({
  exts: ["html", "css", "js", "py", "exe", "json"],
  exclusions: [/dist/],
});
liveReloadServer.watch(ROOT_DIR);

liveReloadServer.watcher.on("change", (filePath) => {
  exec("node build.js dev", (err, stdout, stderr) => {});
});

// Create the Express app
const app = express();

// Middleware
app.use(connectLivereload());
app.use(express.static(CWRAP_DIR)); // Serve static files from CWRAP_DIR
app.use(express.static(ROOT_DIR)); // Serve static files from ROOT_DIR
app.use(bodyParser.json()); // Middleware to parse JSON bodies

// Endpoint to save skeleton.json
app.post("/save-skeleton/:subPath?", (req, res) => {
  const skeletonJson = req.body;
  const subPath = req.params.subPath || "";

  const jsonFilePath = subPath
    ? path.join(ROOT_DIR, "routes", subPath, "skeleton.json")
    : path.join(ROOT_DIR, "routes", "skeleton.json");
  fs.writeFile(jsonFilePath, JSON.stringify(skeletonJson, null, 2), (err) => {
    if (err) {
      console.error("Error saving skeletonBody.json:", err);
      res.status(500).json({ success: false, error: err.message });
    } else {
      console.log("skeletonBody.json saved successfully!");
      res.status(200).json({ success: true });
    }
  });
});

// Endpoint to save template.json
app.post("/save-template", (req, res) => {
  const templateJson = req.body;
  const subPath = req.params.subPath || "";

  const jsonFilePath = subPath
    ? path.join(ROOT_DIR, "routes", subPath, "templates.json")
    : path.join(ROOT_DIR, "routes", "templates.json");
  fs.writeFile(jsonFilePath, JSON.stringify(templateJson, null, 2), (err) => {
    if (err) {
      console.error("Error saving template.json:", err);
      res.status(500).json({ success: false, error: err.message });
    } else {
      console.log("template.json saved successfully!");
      res.status(200).json({ success: true });
    }
  });
});

// Endpoint to save config.json
app.post("/save-config", (req, res) => {
  const configJson = req.body;
  const jsonFilePath = path.join(ROOT_DIR, "config.json");

  fs.writeFile(jsonFilePath, JSON.stringify(configJson, null, 2), (err) => {
    if (err) {
      console.error("Error saving config.json:", err);
      res.status(500).json({ success: false, error: err.message });
    } else {
      console.log("config.json saved successfully!");
      res.status(200).json({ success: true });
    }
  });
});

// API endpoint to fetch skeleton.json
app.get("/api/skeleton", (req, res) => {
  console.log("fetching skeleton.json");
  const jsonFilePath = path.join(ROOT_DIR, "routes", "skeleton.json");

  fs.readFile(jsonFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading skeletonBody.json:", err);
      res.status(500).json({ success: false, error: err.message });
    } else {
      res.status(200).json(JSON.parse(data));
    }
  });
});

// Helper function to recursively read directories and build route paths
function getRoutes(dir, basePath = "") {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let routes = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const fullPath = path.join(basePath, entry.name);
      routes.push(fullPath);
      routes = routes.concat(getRoutes(path.join(dir, entry.name), fullPath));
    }
  }

  return routes;
}

// API endpoint to fetch all routes
app.get("/api/all-routes", (req, res) => {
  const routesPath = path.join(ROOT_DIR, "routes");

  if (!fs.existsSync(routesPath)) {
    res
      .status(404)
      .json({ success: false, message: "Routes directory not found" });
    return;
  }

  try {
    const routes = getRoutes(routesPath);
    res.status(200).json(routes);
  } catch (err) {
    console.error("Error reading routes directory:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// API endpoint to open a routes folder in the file explorer
app.get("/api/open-folder/routes", (req, res) => {
  const routesPath = path.join(ROOT_DIR, "routes");

  exec(`cmd /c start /MAX explorer.exe "${routesPath}"`, (err) => {
    if (err) {
      console.error("Error opening folder:", err);
      res.status(500).json({ success: false, error: err.message });
    } else {
      res.status(200).json({ success: true });
    }
  });
});

// API endpoint to open a static folder in the file explorer
app.get("/api/open-folder/static", (req, res) => {
  const staticPath = path.join(ROOT_DIR, "static");

  if (!fs.existsSync(staticPath)) {
    fs.mkdirSync(staticPath);
  }

  exec(`cmd /c start /MAX explorer.exe "${staticPath}"`, (err) => {
    if (err) {
      console.error("Error opening folder:", err);
      res.status(500).json({ success: false, error: err.message });
    } else {
      res.status(200).json({ success: true });
    }
  });
});

// API endpoint to create a build from build.js file
app.get("/api/build", (req, res) => {
  const buildFilePath = path.join(ROOT_DIR, "build.js");

  if (!fs.existsSync(buildFilePath)) {
    res
      .status(404)
      .json({ success: false, message: "build.js file not found" });
    return;
  }

  exec(`node "${buildFilePath}"`, (err, stdout, stderr) => {
    if (err) {
      console.error("Error executing build.js:", err);
      res.status(500).json({ success: false, error: err.message });
    } else {
      console.log("build.js executed successfully!");
      res.status(200).json({ success: true, output: stdout, error: stderr });
    }
  });
});

// API endpoint to fetch initial settings
app.get("/api/initial-settings", (req, res) => {
  const initialSettingsPath = path.join(BASE_DIR, "settings.json");
  if (!fs.existsSync(initialSettingsPath)) {
    res
      .status(404)
      .json({ success: false, message: "settings.json file not found" });
    return;
  }

  fs.readFile(initialSettingsPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading settings.json:", err);
      res.status(500).json({ success: false, error: err.message });
    } else {
      res.status(200).json(JSON.parse(data));
    }
  });
});

// API endpoint to create initial settings
app.post("/api/create-initial-settings", (req, res) => {
  const initialSettingsPath = path.join(BASE_DIR, "settings.json");
  const settings = req.body;

  // Ensure the directory exists
  fs.mkdirSync(BASE_DIR, { recursive: true });

  fs.writeFile(
    initialSettingsPath,
    JSON.stringify(settings, null, 2),
    (err) => {
      if (err) {
        console.error("Error saving settings.json:", err);
        res.status(500).json({ success: false, error: err.message });
      } else {
        // console.log("settings.json saved successfully!");
        res.status(200).json({ success: true });
      }
    }
  );
});

// API endpoint to list directory contents within the current path
app.get("/api/list-directory", (req, res) => {
  const currentPath = req.query.path || "";
  const dirPath = path.join(ROOT_DIR, "routes", currentPath);
  fs.readdir(dirPath, { withFileTypes: true }, (err, entries) => {
    if (err) {
      console.error("Error reading directory:", err);
      res.status(500).json({ success: false, error: err.message });
    } else {
      const directories = entries
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name);
      res.status(200).json(directories);
    }
  });
});

// Middleware to serve index.html for any other route
app.get("*", (req, res) => {
  const indexPath = isDevelopment
    ? path.join(ROOT_DIR, "dist", "index.html")
    : path.join(CWRAP_DIR, "index.html");
  res.sendFile(indexPath);
});

// Start the server
app.listen(HTTP_PORT, () => {
  console.log(`Server running at http://localhost:${HTTP_PORT}`);
});
