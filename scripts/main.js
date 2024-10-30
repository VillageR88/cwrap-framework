/**
 * @type {import('./_globals.js')}
 */
import eventHandlers from "./eventHandlers.js";
import initialLoader from "./initialLoader.js";
import loadTheme from "./loadTheme.js";

document.addEventListener("DOMContentLoaded", async () => {
	try {
		const response = await fetch("/api/initial-settings");
		if (!response.ok) {
			throw new Error();
		}
		const data = await response.json();
		loadTheme(data.theme);
		global.settings = data;
		// console.log("response", global.settings); // debugging
	} catch (error) {
		const localStorageTheme = localStorage.getItem("theme");
		if (localStorageTheme) {
			loadTheme(localStorageTheme);
		} else {
			loadTheme(" dark");
		}
		console.warn("Failed to fetch initial settings");
	}
	initialLoader();
	eventHandlers();
;
});
