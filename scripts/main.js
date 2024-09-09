import loadPreview from "./loadPreview.js";
import initializeAwesomplete from "./initializeAwesomplete.js";
import {
  setupElementSelectChangeHandler,
  setupScreenSizeSelectChangeHandler,
  setupElementHandlers,
  setupPropertyHandlers,
  setupMenuHandlers,
  setupScreenHandlers,
  setupPropertySelectChangeHandler,
  setupAttributeSelectChangeHandler,
  setupStateSelectAllChangeHandler,
} from "./eventHandlers.js";
import fetchCSSProperties from "./fetchCSSProperties.js";
const SKELETON_SOURCE_SKELETON_BODY = "templates/skeletonBody.json";
const fontMap = new Map();
const rootMap = new Map();
const cssMap = new Map();
const mediaQueriesMap = new Map();
// Initialize a Map to store media queries

// Load the preview when the script is executed
loadPreview(SKELETON_SOURCE_SKELETON_BODY, fontMap, cssMap, mediaQueriesMap);

// Set an event listener for when the DOM content is fully loaded
document.addEventListener("DOMContentLoaded", async () => {
  const cssProperties = await fetchCSSProperties();
  setupMenuHandlers(fontMap, cssMap, mediaQueriesMap);
  setupScreenHandlers(mediaQueriesMap);
  setupElementSelectChangeHandler(cssMap, mediaQueriesMap, cssProperties);
  setupScreenSizeSelectChangeHandler(cssMap, mediaQueriesMap);
  setupPropertySelectChangeHandler(cssMap, mediaQueriesMap);
  setupAttributeSelectChangeHandler();
  setupElementHandlers(cssMap, mediaQueriesMap);
  setupPropertyHandlers(cssMap, mediaQueriesMap, cssProperties);
  setupStateSelectAllChangeHandler(cssMap, mediaQueriesMap);
  initializeAwesomplete(cssProperties);
});
