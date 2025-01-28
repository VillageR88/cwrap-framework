import hljs from "highlight.js/lib/core";

const version = document.getElementById("version");
window.onload = async () => {
	if (version) {
		try {
			const response = await fetch(
				"https://registry.npmjs.org/cwrap-framework/latest",
			);
			if (response.ok) {
				const data = await response.json();
				version.textContent = `Version: ${data.version}`;
			} else {
				console.error("Failed to fetch version information");
			}
		} catch (error) {
			console.error("Error fetching version information:", error);
		}
	}
};

document.addEventListener("DOMContentLoaded", () => {
	hljs.highlightAll();
});
