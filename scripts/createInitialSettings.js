import resolveInitialSettings from "./resolveInitialSettings.js";

export default async function createInitialSettings(settings) {
	const body =
		settings ||
		JSON.stringify({
			theme: localStorage.getItem("theme") || "_dark",
			keybindings: {
				"toggle cwrap control in preview": "ctrl+shift+h",
			},
		});
	console.log("createInitialSettings() called"); // debugging
	try {
		// post request to /api/create-initial-settings
		const response = await fetch("/api/create-initial-settings", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				theme: localStorage.getItem("theme") || "_dark",
				keybindings: {
					"toggle cwrap control in preview": "ctrl+shift+h",
					"toggle highlight control in preview": "ctrl+shift+space",
				},
			}),
		});
		if (!response.ok) {
			return Error("Failed to create initial settings");
		}
		resolveInitialSettings();
	} catch (error) {
		console.error("Error creating initial settings:", error);
		throw new Error("Error creating initial settings");
	}
}
