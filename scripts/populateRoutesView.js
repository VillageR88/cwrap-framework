import initialLoader from "./initialLoader.js";
import { loadBodyView } from "./loadView.js";

/**
 * @type {import('./_globals.js')}
 */
export default async function populateRoutesView() {
	const colorFill = document.documentElement.style.getPropertyValue(
		"--colorFill-regular",
	);
	const routesTree = global.id?.routesTree; //get routes view div
	if (!routesTree) {
		console.error("routesTree is not defined");
		return; // Stop the function if routesTree is not defined
	}
	routesTree.innerHTML = ""; //clear routes view div
	const svgImageFolder = `
		<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
			<path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640H447l-80-80H160v480l96-320h684L837-217q-8 26-29.5 41.5T760-160H160Zm84-80h516l72-240H316l-72 240Zm0 0 72-240-72 240Zm-84-400v-80 80Z" />
		</svg>`;
	const folderButton = document.createElement("button");
	folderButton.innerHTML = svgImageFolder;
	folderButton.title = "open folder";
	folderButton.addEventListener("click", () => {
		try {
			fetch("/api/open-folder/routes");
		} catch (error) {
			console.error("Error opening folder:", error);
			return; // Stop the function if an error occurs
		}
	});
	folderButton.classList.add("mediumButtons");

	const syncButton = document.createElement("button");
	const svgImageSync = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" ><path d="M160-160v-80h110l-16-14q-52-46-73-105t-21-119q0-111 66.5-197.5T400-790v84q-72 26-116 88.5T240-478q0 45 17 87.5t53 78.5l10 10v-98h80v240H160Zm400-10v-84q72-26 116-88.5T720-482q0-45-17-87.5T650-648l-10-10v98h-80v-240h240v80H690l16 14q49 49 71.5 106.5T800-482q0 111-66.5 197.5T560-170Z"/></svg>`;
	syncButton.innerHTML = svgImageSync;
	syncButton.title = "sync routes";
	syncButton.addEventListener("click", async () => {
		populateRoutesView();
	});
	syncButton.classList.add("mediumButtons");

	const navButtonDiv = document.createElement("div");
	navButtonDiv.appendChild(folderButton);
	navButtonDiv.appendChild(syncButton);
	routesTree.appendChild(navButtonDiv);

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
			button.style.color = colorFill;
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
}
