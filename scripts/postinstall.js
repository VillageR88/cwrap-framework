const fs = require("node:fs");
const path = require("node:path");
const { execSync } = require("node:child_process");

// Correct path to the project's package.json
const projectPackageJsonPath = path.join(
	__dirname,
	"..",
	"..",
	"..",
	"package.json",
);
const cwrapPath = path.join(
	__dirname,
	"..",
	"..",
	"..",
	"node_modules",
	"cwrap",
);
const rootPath = path.join(__dirname, "..", "..", "..");
const logFilePath = path.join(rootPath, "installation.log");
const lockFilePath = path.join(rootPath, "postinstall.lock");

// Function to log messages to a file
function logMessage(...messages) {
	const logEntry = messages
		.map((msg) => `${new Date().toISOString()} - ${msg}`)
		.join(" ");
	fs.appendFileSync(logFilePath, `${logEntry}\n`);
}

// Function to check if the script is already running
function isScriptRunning() {
	return fs.existsSync(lockFilePath);
}

// Function to create a lock file
function createLockFile() {
	fs.writeFileSync(lockFilePath, "");
}

// Function to remove the lock file
function removeLockFile() {
	fs.unlinkSync(lockFilePath);
}

// Check if the script is already running
if (isScriptRunning()) {
	logMessage("Script is already running. Exiting.");
	process.exit(0);
}

// Create a lock file to prevent multiple executions
createLockFile();

// Log the projectPackageJsonPath
logMessage("projectPackageJsonPath:", projectPackageJsonPath);

// Check if the project's package.json exists
if (!fs.existsSync(projectPackageJsonPath)) {
	// Create a new package.json if it doesn't exist
	const newPackageJson = {
		name: "new-project",
		version: "1.0.0",
		description: "",
		main: "index.js",
		scripts: {
			start: "node server.js",
		},
		keywords: [],
		author: "",
		license: "ISC",
		dependencies: {
			cwrap: "github:VillageR88/cwrap",
		},
		devDependencies: {},
	};
	fs.writeFileSync(
		projectPackageJsonPath,
		JSON.stringify(newPackageJson, null, 2),
	);
	logMessage("Created new package.json");
}

// Create the routes folder in the root directory of the project
const routesPath = path.join(rootPath, "routes");
if (!fs.existsSync(routesPath)) {
	fs.mkdirSync(routesPath);
	logMessage("Created routes folder in the root directory of the project");
} else {
	logMessage(
		"Routes folder already exists in the root directory of the project",
	);
}

// Copy skeleton.json from templates folder of cwrap to routes folder if it does not exist
const skeletonSrcPath = path.join(cwrapPath, "templates", "skeleton.json");
const skeletonDestPath = path.join(routesPath, "skeleton.json");
if (!fs.existsSync(skeletonDestPath)) {
	try {
		fs.copyFileSync(skeletonSrcPath, skeletonDestPath);
		logMessage("Copied skeleton.json to routes folder");
	} catch (error) {
		logMessage("Error copying skeleton.json:", error.message);
		removeLockFile();
		process.exit(1);
	}
} else {
	logMessage("skeleton.json already exists in the routes folder");
}

// Move server.js from cwrap to root folder if it does not exist
const serverSrcPath = path.join(cwrapPath, "server.js");
const serverDestPath = path.join(rootPath, "server.js");
if (!fs.existsSync(serverDestPath)) {
	try {
		fs.copyFileSync(serverSrcPath, serverDestPath);
		logMessage("Moved server.js to root folder");
	} catch (error) {
		logMessage("Error moving server.js:", error.message);
		removeLockFile();
		process.exit(1);
	}
} else {
	logMessage("server.js already exists in the root folder");
}

// Remove the lock file
removeLockFile();

logMessage("Installation complete");
