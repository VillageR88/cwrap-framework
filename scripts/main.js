/**
 * @type {import('./_globals.js')}
 */

import initializeAwesomplete from "./initializeAwesomplete.js";
import eventHandlers from "./eventHandlers.js";
import fetchCSSProperties from "./fetchCSSProperties.js";
import initialLoader from "./initialLoader.js";

initialLoader();
document.addEventListener("DOMContentLoaded", async () => {
	const cssProperties = await fetchCSSProperties();
	eventHandlers(cssProperties);
	initializeAwesomplete(cssProperties);
});
