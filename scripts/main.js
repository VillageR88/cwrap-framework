/**
 * @type {import('./_globals.js')}
 */
import eventHandlers from "./eventHandlers.js";
import initialLoader from "./initialLoader.js";
const storedPathname = localStorage.getItem("storedPathname");

initialLoader();
document.addEventListener("DOMContentLoaded", async () => {
	eventHandlers();
});
