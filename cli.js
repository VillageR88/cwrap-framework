#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { execSync } = require("node:child_process");
const readline = require("node:readline");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

rl.question("Enter project name (default: my-new-cwrap-project): ", (input) => {
	const projectName = input.trim() || "my-new-cwrap-project"; // Default project name

	const projectPath = path.resolve(process.cwd(), projectName);

	if (fs.existsSync(projectPath)) {
		console.error(`Directory ${projectPath} already exists.`);
		process.exit(1);
	}

	fs.mkdirSync(projectPath, { recursive: true });
	console.log(`Creating a new project in ${projectPath}`);

	const packageJson = {
		name: projectName,
		version: "1.0.0",
		main: "index.js",
		scripts: {
			start: "start http://localhost:36969 && node server.js",
		},
		devDependencies: {
			// cwrap: "file:../../cw_blog_preview_card/cwrap-0.1.0-alpha.20241008.tgz",
			"cwrap-framework": "0.1.0-alpha.20241008",
			"body-parser": "^1.20.2",
			connect: "^3.7.0",
			"connect-livereload": "^0.6.1",
			jsdom: "^24.1.1",
			livereload: "^0.9.3",
			mkdirp: "^3.0.1",
			"serve-static": "^1.14.1",
		},
	};

	fs.writeFileSync(
		path.join(projectPath, "package.json"),
		JSON.stringify(packageJson, null, 2),
	);

	console.log("Installing packages. This might take a couple of minutes.");
	// execSync("npm install", { stdio: "inherit", cwd: projectPath });
	execSync("npm install");

	console.log("Project setup complete!");

	rl.close();
});
