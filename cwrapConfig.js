// Define here a all const to be used as cwrapReference in build.js runEmbeddedScripts function.
const globals = require("./routes/globals.json");
const definitions = {
  documentation: {
    text: "{{cwrapContext.set('route',cwrapRoute.split('\\\\')); return '';}}cwrapTemplate[documentation(prefix=../../,prefixAside=../,{{return cwrapContext.get('route')[1]}}Focus=focus)]",
  },
};

/**
 * @type {Object}
 * Data used in build.js runEmbeddedScripts passed as property to retrieve it while using function in JSON.
 */
const cwrapReference = { globals, definitions };

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

module.exports = { notNthEnumerableElements, cwrapReference };
