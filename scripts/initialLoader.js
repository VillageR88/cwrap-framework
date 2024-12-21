import loadTemplatesSource from "./loadTemplatesSource.js";
import loadSkeletonSource from "./loadSkeletonSource.js";
import loadRoot from "./loadRoot.js";
import loadHead from "./loadHead.js";
import loadFont from "./loadFont.js";
import loadPreview from "./loadPreview.js";

export default function initialLoader() {
  loadTemplatesSource();
  loadSkeletonSource()
    .then((jsonObj) => {
      if (typeof jsonObj !== "object" || jsonObj === null) {
        throw new Error("jsonObj is not an object");
      }

      loadHead(jsonObj);
      loadFont(jsonObj);
      loadRoot(jsonObj);
      loadPreview(jsonObj);
    })
    .catch((error) => {
      console.error("Error loading skeleton source:", error);
    });
}
