const bodyParser = require("body-parser");
const connect = require("connect");
const connectLivereload = require("connect-livereload");
const livereload = require("livereload");
const serveStatic = require("serve-static");
const { exec } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

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

// Create and configure the connect server
const app = connect();
app.use(connectLivereload());
app.use(serveStatic(CWRAP_DIR)); // Serve static files from CWRAP_DIR
app.use(serveStatic(ROOT_DIR)); // Serve static files from ROOT_DIR
app.use(bodyParser.json()); // Middleware to parse JSON bodies

// Endpoint to save skeleton.json
app.use("/save-skeleton", (req, res) => {
	const skeletonJson = req.body;
	const jsonFilePath = path.join(ROOT_DIR, "routes", "skeleton.json");

	fs.writeFile(jsonFilePath, JSON.stringify(skeletonJson, null, 2), (err) => {
		if (err) {
			console.error("Error saving skeletonBody.json:", err);
			res.writeHead(500, { "Content-Type": "application/json" });
			res.end(JSON.stringify({ success: false, error: err.message }));
		} else {
			console.log("skeletonBody.json saved successfully!");
			res.writeHead(200, { "Content-Type": "application/json" });
			res.end(JSON.stringify({ success: true }));
		}
	});
});

// API endpoint to fetch skeleton.json
app.use("/api/skeleton", (req, res) => {
	console.log("fetching skeleton.json");
	const jsonFilePath = path.join(ROOT_DIR, "routes", "skeleton.json");

	fs.readFile(jsonFilePath, "utf8", (err, data) => {
		if (err) {
			console.error("Error reading skeletonBody.json:", err);
			res.writeHead(500, { "Content-Type": "application/json" });
			res.end(JSON.stringify({ success: false, error: err.message }));
		} else {
			res.writeHead(200, { "Content-Type": "application/json" });
			res.end(data);
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
app.use("/api/all-routes", (req, res) => {
	// Define the path to the routes directory
	const routesPath = path.join(ROOT_DIR, "routes");

	// Check if the routes directory exists
	if (!fs.existsSync(routesPath)) {
		// Send a 404 Not Found response if the routes directory does not exist
		res.writeHead(404, { "Content-Type": "application/json" });
		res.end(
			JSON.stringify({ success: false, message: "Routes directory not found" }),
		);
		return;
	}

	try {
		// Get all routes recursively
		const routes = getRoutes(routesPath);

		// Send a 200 OK response with the list of route names in JSON format
		res.writeHead(200, { "Content-Type": "application/json" });
		res.end(JSON.stringify(routes));
	} catch (err) {
		// Log the error to the console
		console.error("Error reading routes directory:", err);
		// Send a 500 Internal Server Error response with the error message
		res.writeHead(500, { "Content-Type": "application/json" });
		res.end(JSON.stringify({ success: false, error: err.message }));
	}
});

// API endpoint to open a routes folder in the file explorer
app.use("/api/open-folder/routes", (req, res) => {
	const routesPath = path.join(ROOT_DIR, "routes");

	// Use cmd to start the folder maximized
	exec(`cmd /c start /MAX explorer.exe "${routesPath}"`, (err) => {
		if (err) {
			console.error("Error opening folder:", err);
			res.writeHead(500, { "Content-Type": "application/json" });
			res.end(JSON.stringify({ success: false, error: err.message }));
		} else {
			res.writeHead(200, { "Content-Type": "application/json" });
			res.end(JSON.stringify({ success: true }));
		}
	});
});

//API endpoint to open a static folder in the file explorer
app.use("/api/open-folder/static", (req, res) => {
	const staticPath = path.join(ROOT_DIR, "static");

	// Use cmd to start the folder maximized
	exec(`cmd /c start /MAX explorer.exe "${staticPath}"`, (err) => {
		if (err) {
			console.error("Error opening folder:", err);
			res.writeHead(500, { "Content-Type": "application/json" });
			res.end(JSON.stringify({ success: false, error: err.message }));
		} else {
			res.writeHead(200, { "Content-Type": "application/json" });
			res.end(JSON.stringify({ success: true }));
		}
	});
});

// Middleware to serve index.html for any other route
app.use((req, res, next) => {
	if (
		req.method === "GET" &&
		!req.url.startsWith("/api") &&
		!req.url.startsWith("/save-skeleton")
	) {
		const indexPath = path.join(CWRAP_DIR, "index.html");
		fs.readFile(indexPath, (err, data) => {
			if (err) {
				console.error("Error reading index.html:", err);
				res.writeHead(500, { "Content-Type": "text/html" });
				res.end("Internal Server Error");
			} else {
				res.writeHead(200, { "Content-Type": "text/html" });
				res.end(data);
			}
		});
	} else {
		next();
	}
});

// Start the server
app.listen(HTTP_PORT, () => {
	console.log(`Server running at http://localhost:${HTTP_PORT}`);
});
