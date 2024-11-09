/**
 * @typedef {Object} JsonObject
 * @property {Object} head - The head section of the document.
 * @property {string} head.title - The title of the document.
 * @property {Array<Object>} head.link - Array of link elements for stylesheets and icons.
 * @property {string} head.link.rel - The relationship between the current document and the linked document.
 * @property {string} head.link.href - The URL of the linked document.
 * @property {string} head.link.type - The MIME type of the linked document.
 * @property {Array<Object>} head.meta - Array of meta elements for metadata.
 * @property {string} head.meta.name - The name of the metadata.
 * @property {string} head.meta.content - The content of the metadata.
 * @property {string} head.meta.charset - The character encoding for the document.
 * @property {Object} root - The root styles for the document.
 * @property {Object} fonts - The font styles for the document.
 * @property {Array<Object>} classroom - Array of classroom elements.
 * @property {string} classroom.name - The name of the classroom element.
 * @property {string} classroom.type - The type of the classroom element (e.g., 'element', 'class').
 * @property {string} classroom.style - The CSS styles for the classroom element.
 * @property {string} element - The HTML element type (e.g., 'div', 'span').
 * @property {Object} [style] - The CSS styles for the element.
 * @property {Array<Object>} [extend] - Array of extensions for the element.
 * @property {string} extend.extension - The CSS extension (e.g., '::before', ':hover').
 * @property {string} extend.style - The CSS styles for the extension.
 * @property {Array<Object>} [mediaQueries] - Array of media queries for the element.
 * @property {string} mediaQueries.query - The media query condition (e.g., 'max-width: 640px').
 * @property {string} mediaQueries.style - The CSS styles for the media query.
 * @property {Array<JsonObject>} [children] - Array of child elements.
 * @property {Object} [attributes] - The attributes for the element.
 * @property {string} [text] - The text content for the element.
 * @property {Object} [blueprint] - The blueprint for the element.
 * @property {string} blueprint.element - The HTML element type for the blueprint.
 * @property {string} blueprint.style - The CSS styles for the blueprint element.
 * @property {number} blueprint.count - The number of blueprint elements.
 * @property {Array<JsonObject>} blueprint.children - Array of child elements for the blueprint.
 * @property {Array<Object>} blueprint.extend - Array of extensions for the blueprint element.
 * @property {string} blueprint.extend.extension - The CSS extension for the blueprint element.
 * @property {string} blueprint.extend.style - The CSS styles for the blueprint extension.
 */

export const Types = {};