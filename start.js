const { exec } = require("node:child_process");
const os = require("node:os");

const url = "http://localhost:36969";

const openUrl = (url) => {
	switch (os.platform()) {
		case "win32":
			exec(`start ${url}`);
			break;
		case "darwin":
			exec(`open ${url}`);
			break;
		case "linux":
			exec(`xdg-open ${url}`);
			break;
		default:
			console.log(`Please open ${url} in your browser.`);
	}
};

openUrl(url);
