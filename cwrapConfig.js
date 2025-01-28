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

module.exports = { notNthEnumerableElements };
