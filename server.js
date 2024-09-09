const connect = require("connect");
const serveStatic = require("serve-static");
const livereload = require("livereload");
const connectLivereload = require("connect-livereload");
const { exec } = require("node:child_process");
const bodyParser = require("body-parser");
const fs = require("node:fs");
const path = require("node:path");

const HTTP_PORT = 36969;

// Create and configure the livereload server
const liveReloadServer = livereload.createServer({
  exts: ["html", "css", "js", "py", "exe"],
});
liveReloadServer.watch(__dirname);

// Create and configure the connect server
const app = connect();
app.use(connectLivereload());
app.use(serveStatic(__dirname));
app.use(bodyParser.json()); // Middleware to parse JSON bodies

// Endpoint to save skeletonBody.json
app.use("/save-skeleton-body", (req, res) => {
  const skeletonBodyJson = req.body;
  const jsonFilePath = path.join(__dirname, "templates", "skeletonBody.json");

  fs.writeFile(
    jsonFilePath,
    JSON.stringify(skeletonBodyJson, null, 2),
    (err) => {
      if (err) {
        console.error("Error saving skeletonBody.json:", err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: err.message }));
      } else {
        console.log("skeletonBody.json saved successfully!");
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true }));
      }
    }
  );
});

// Start the server
app.listen(HTTP_PORT, () => {
  console.log(`Server running at http://localhost:${HTTP_PORT}`);
});
