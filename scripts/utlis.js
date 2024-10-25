//Welcome to goodie room

/**
 * @param {string} id - The id of the element to create.
 * @param {number} count - The number of list items to create.
 * @param {"input" | "button" | "div" | "span" | "label"} element - The type of element to create.
 * @param {string} type - The type of input element to create.
 */
export function createListItems(id, count, element, type) {
	for (let i = 0; i < count; i++) {
		const li = document.createElement("li");
		const label = document.createElement("label");
		const span = document.createElement("span");
		const newElement = document.createElement(element);
		span.textContent = `${i + 1}`;
		label.classList.add("circle");
		newElement.type = type;
		newElement.name = `${id}Group`; // Ensure all radio buttons have the same name
		newElement.style.display = "none";
		label.appendChild(span);
		label.appendChild(newElement);
		li.appendChild(label);
		document.getElementById(id).appendChild(li);
	}
}