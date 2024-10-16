import initialLoader from "./initialLoader.js";
import { loadBodyView } from "./loadView.js";

/**
 * @type {import('./_globals.js')}
 */
export default async function populateRoutesView() {
	const routesTree = global.id?.routesTree; //get routes view div
	if (!routesTree) {
		console.error("routesTree is not defined");
		return; // Stop the function if routesTree is not defined
	}
	routesTree.innerHTML = ""; //clear routes view div

	let routes = [];
	try {
		routes = await fetch("/api/all-routes").then((response) => response.json());
	} catch (error) {
		console.error("Error loading routes:", error);
		return; // Stop the function if an error occurs
	}

	// Function to create tree structure recursively
	function createTree(paths, parentElement) {
		const ul = document.createElement("ul");
		for (const path of paths) {
			const li = document.createElement("li");
			const button = document.createElement("button");
			button.style.color = "white"; //Temporary TODO then remove
			button.classList.add("mediumButtons");
			button.textContent = path.name;
			button.addEventListener("click", () => {
				if (path.name !== "home") window.location.href = path.name;
				else window.location.href = "/";
			});
			li.appendChild(button);
			if (path.children.length > 0) {
				createTree(path.children, li);
			}
			ul.appendChild(li);
		}
		parentElement.appendChild(ul);
	}

	// Function to build nested routes
	function buildNestedRoutes(routes) {
		const root = { name: "home", children: [] };
		const map = { Home: root };
		for (const route of routes) {
			const parts = route.split("\\");
			let currentLevel = root.children;
			for (const part of parts) {
				if (!map[part]) {
					const newNode = { name: part, children: [] };
					currentLevel.push(newNode);
					map[part] = newNode;
				}
				currentLevel = map[part].children;
			}
		}
		return [root];
	}

	const nestedRoutes = buildNestedRoutes(routes);
	createTree(nestedRoutes, routesTree);
	const svgImage = `
		<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
			<path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640H447l-80-80H160v480l96-320h684L837-217q-8 26-29.5 41.5T760-160H160Zm84-80h516l72-240H316l-72 240Zm0 0 72-240-72 240Zm-84-400v-80 80Z" />
		</svg>`;
	const folderButton = document.createElement("button");
	folderButton.innerHTML = svgImage;
	folderButton.addEventListener("click", () => {
		try {
			fetch("/api/open-folder/routes");
		} catch (error) {
			console.error("Error opening folder:", error);
			return; // Stop the function if an error occurs
		}
	});

	folderButton.classList.add("mediumButtons");
	routesTree.appendChild(folderButton);
}

/*

import getElementPath from "./getElementPath.js";
import highlightSelectedElement from "./highlightSelectedElement.js";
import nestElementInElement from "./nestElementInElement.js";

//TODO drag and drop
export default function populateTreeView() {
	const previewDocument =
		global.id.preview.contentDocument ||
		global.id.preview.contentWindow.document;
	const treeView = global.id.previewTree;
	treeView.innerHTML = "";
	const bodyElement = previewDocument.body;
	const tree = document.createElement("ul");

	// Function to create tree structure recursively
	function createTree(element, parentListItem) {
		if (element.children.length > 0) {
			const subList = document.createElement("ul");
			for (const child of element.children) {
				const subListItem = document.createElement("li");
				const subText = document.createTextNode(child.tagName.toLowerCase());
				const newButton = document.createElement("button");
				newButton.classList.add("mediumButtons");
				newButton.draggable = true;
				newButton.addEventListener("click", () => {
					global.id.elementSelect.value = getElementPath(child);
					global.id.nameHelper.textContent = getElementPath(child);
					highlightSelectedElement();
				});
				newButton.addEventListener("dragstart", (event) => {
					event.dataTransfer.setData("text/plain", event.target.value);
				});
				newButton.addEventListener("dragover", (event) => {
					event.preventDefault();
				});
				newButton.addEventListener("drop", (event) => {
					event.preventDefault();
					const draggedValue = event.dataTransfer.getData("text/plain");
					nestElementInElement(draggedValue, event.target.value);
				});
				// Use the imported getElementPath function
				newButton.value = getElementPath(child);
				newButton.appendChild(subText);
				subListItem.appendChild(newButton);
				subList.appendChild(subListItem);
				createTree(child, subListItem);
			}
			parentListItem.appendChild(subList);
		}
	}

	// Create the root list item for the body element
	const rootListItem = document.createElement("li");
	const bodyText = document.createTextNode(bodyElement.tagName.toLowerCase());
	const bodyButton = document.createElement("button");
	bodyButton.classList.add("mediumButtons");
	bodyButton.addEventListener("click", () => {
		global.id.elementSelect.value = "body";
		global.id.nameHelper.textContent = "body";
		highlightSelectedElement();
	});
	bodyButton.appendChild(bodyText);
	bodyButton.value = "body";

	rootListItem.appendChild(bodyButton);
	tree.appendChild(rootListItem);

	// Start creating the tree from the children of the body element
	createTree(bodyElement, rootListItem);

	treeView.appendChild(tree);
}

*/
