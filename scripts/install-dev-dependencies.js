const { exec } = require("child_process");
const path = require("node:path");

const projectRootPath = path.join(__dirname, "..", "..", "..");

// Function to log messages to the console
function logMessage(...messages) {
	const logEntry = messages.join(" ");
	console.log(`${new Date().toISOString()} - ${logEntry}`);
}

// Change directory to the project root and run `npm install --save-dev`
exec(
	`cd ${projectRootPath} && npm install --save-dev connect livereload connect-livereload serve-static body-parser mkdirp jsdom`,
	(error, stdout, stderr) => {
		if (error) {
			logMessage(`Error: ${error.message}`);
			return;
		}
		if (stderr) {
			logMessage(`stderr: ${stderr}`);
			return;
		}
		logMessage(`stdout: ${stdout}`);
	},
);
