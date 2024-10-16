/**
 * @type {import('./_globals.js')}
 */
import eventHandlers from "./eventHandlers.js";
import initialLoader from "./initialLoader.js";
import loadTheme from "./loadTheme.js";

loadTheme();
initialLoader();
document.addEventListener("DOMContentLoaded", async () => {
	eventHandlers();
});
