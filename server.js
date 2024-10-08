const connect = require("connect");
const serveStatic = require("serve-static");
const livereload = require("livereload");
const connectLivereload = require("connect-livereload");
const { exec } = require("node:child_process");
const bodyParser = require("body-parser");
const fs = require("node:fs");
const path = require("node:path");

const HTTP_PORT = 36969;
const ROOT_DIR = path.resolve(__dirname);
const CWRAP_DIR = process.env.DEV
	? path.resolve(__dirname)
	: path.resolve("node_modules", "cwrap");

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

// Middleware to serve index.html for any other route
app.use((req, res, next) => {
	if (
		req.method === "GET" &&
		!req.url.startsWith("/api") &&
		!req.url.startsWith("/save-skeleton")
	) {
		const indexPath = path.join(ROOT_DIR, "index.html");
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
