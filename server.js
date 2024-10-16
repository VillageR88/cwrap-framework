const express = require("express");
const livereload = require("livereload");
const connectLivereload = require("connect-livereload");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");

const HTTP_PORT = 36969;
const ROOT_DIR = path.resolve(__dirname);
const CWRAP_DIR = process.env.DEV
	? path.resolve(__dirname)
	: path.resolve("node_modules", "cwrap-framework");

// Create and configure the livereload server
const liveReloadServer = livereload.createServer({
	exts: ["html", "css", "js", "py", "exe"],
});
liveReloadServer.watch(CWRAP_DIR);

// Create the Express app
const app = express();

// Middleware
app.use(connectLivereload());
app.use(express.static(CWRAP_DIR)); // Serve static files from CWRAP_DIR
app.use(express.static(ROOT_DIR)); // Serve static files from ROOT_DIR
app.use(bodyParser.json()); // Middleware to parse JSON bodies

// Endpoint to save skeleton.json
app.post("/save-skeleton", (req, res) => {
	const skeletonJson = req.body;
	const jsonFilePath = path.join(ROOT_DIR, "routes", "skeleton.json");

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

// Middleware to serve index.html for any other route
// Middleware to serve index.html for any other route
app.get("*", (req, res) => {
	const indexPath = path.join(CWRAP_DIR, "index.html");
	res.sendFile(indexPath); // Express will automatically set the correct Content-Type
});

// Start the server
app.listen(HTTP_PORT, () => {
	console.log(`Server running at http://localhost:${HTTP_PORT}`);
});
