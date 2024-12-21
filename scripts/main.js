/**
 * @type {import('./_globals.js')}
 */
import eventHandlers from "./eventHandlers.js";
import initialLoader from "./initialLoader.js";
import initialSettingsLoader from "./initialSettingsLoader.js";
import projectConfigLoader from "./projectConfigLoader.js";

document.addEventListener("DOMContentLoaded", async () => {
  await initialSettingsLoader();
  await projectConfigLoader();
  initialLoader();
  eventHandlers();
});
