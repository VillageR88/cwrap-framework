const globals = require("./routes/globals.json");

/**
 * @type {Object}
 * Data used in build.js runEmbeddedScripts passed as property to retrieve it while using function in JSON.
 */
const devRef = { globals };

/**
 * @type {Object}
 * Global configuration settings.
 */

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

module.exports = { notNthEnumerableElements, devRef };
