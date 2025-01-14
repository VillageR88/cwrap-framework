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
  if (global.localSettings["no-gui"]) {
    const iframe = document.querySelector("iframe");
    if (iframe) {
      iframe.classList.toggle("cwrap-only");
    }
    global.id.navSelectPreview.classList.remove("preview", "tree");
    global.id.navSelectPreview.classList.add("static");
  }
});
