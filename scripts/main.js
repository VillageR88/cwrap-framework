/**
 * @type {import('./_globals.js')}
 */
import eventHandlers from "./eventHandlers.js";
import initialLoader from "./initialLoader.js";

initialLoader();
document.addEventListener("DOMContentLoaded", async () => {
	eventHandlers();
});

