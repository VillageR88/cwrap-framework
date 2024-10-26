/**
 * Creates and appends cloned elements to a specified parent element.
 *
 * @param {string} id - The id of the parent element to append the cloned elements to.
 * @param {number} count - The number of cloned elements to create.
 * @param {function(number): HTMLElement} element - A function that returns an element when called with the current index.
 *    The number passed to the function is the current index of the iteration.
 */
export function createListItems(id, count, element) {
	for (let i = 0; i < count; i++) {
		const liElement = document.createElement("li");
		const elementClone = element(liElement, i).cloneNode(true);
		document.getElementById(id).appendChild(elementClone);
	}
}

export function getQueryParams() {
	const params = {};
	const queryString = window.location.search.substring(1);
	const queryArray = queryString.split("&");
	for (const param of queryArray) {
		const [key, value] = param.split("=");
		params[key] = decodeURIComponent(value);
	}
	return params;
}
