// Define here a all const to be used as cwrapReference in build.js runEmbeddedScripts function.
const globals = require("./routes/globals.json");

/**
 * @type {Object}
 * Data used in build.js runEmbeddedScripts passed as property to retrieve it while using function in JSON.
 */
const cwrapReference = { globals };

/**
 * @type {Object}
 * Global configuration settings.
 */

// Define here a list of HTML elements that should not be considered for nth-child enumeration.
/**
 * An array of HTML elements that should not be considered for nth-child enumeration.
 * @type {string[]}
 */
const notNthEnumerableElements = [
  "body",
  "nav",
  "header",
  "main",
  "footer",
  "html",
];

const buildConfig = {
  convertDynamicBuildToStatic: true,
  deleteDynamicRoutesAfterStaticConversion: true,
};

module.exports = { notNthEnumerableElements, cwrapReference, buildConfig };
