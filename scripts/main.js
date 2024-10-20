/**
 * @type {import('./_globals.js')}
 */
import eventHandlers from "./eventHandlers.js";
import initialLoader from "./initialLoader.js";
import loadTheme from "./loadTheme.js";

const localStorageTheme = localStorage.getItem("theme");
if (localStorageTheme) loadTheme(localStorageTheme);
else loadTheme("_dark");
initialLoader();
document.addEventListener("DOMContentLoaded", async () => {
	eventHandlers();
});
