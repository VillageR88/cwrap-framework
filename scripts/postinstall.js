const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

// Correct path to the project's package.json
const projectPackageJsonPath = path.join(
	__dirname,
	"..",
	"..",
	"..",
	"package.json",
);
const cwrapPath = path.join(__dirname);

// Check if the project's package.json exists
if (!fs.existsSync(projectPackageJsonPath)) {
	// Create a new package.json if it doesn't exist
	const newPackageJson = {
		name: "new-project",
		version: "1.0.0",
		description: "",
		main: "index.js",
		scripts: {},
		keywords: [],
		author: "",
		license: "ISC",
	};
	fs.writeFileSync(
		projectPackageJsonPath,
		JSON.stringify(newPackageJson, null, 2),
	);
}

// Read the project's package.json
const projectPackageJson = JSON.parse(
	fs.readFileSync(projectPackageJsonPath, "utf8"),
);

// Add the necessary scripts
projectPackageJson.scripts = projectPackageJson.scripts || {};
projectPackageJson.scripts.start = "cd node_modules/cwrap && npm start";

// Write the updated package.json back to the project
fs.writeFileSync(
	projectPackageJsonPath,
	JSON.stringify(projectPackageJson, null, 2),
);

// Run npm install in the cwrap directory
exec("npm install", { cwd: cwrapPath }, (error, stdout, stderr) => {
	if (error) {
		console.error(`Error: ${error.message}`);
		return;
	}
	if (stderr) {
		console.error(`Stderr: ${stderr}`);
		return;
	}
	console.log(`Stdout: ${stdout}`);
});

console.log("Installation complete");
