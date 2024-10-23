/**
 * @typedef {import('./types.js').JsonObject} JsonObject
 * @typedef {import('./_globals.js')}
 */
/**
 *
 * @param {JsonObject} jsonObj
 */
export default function loadHead(jsonObj) {
	global.map.headMap.clear();
	if (jsonObj.head) {
		for (const [key, value] of Object.entries(jsonObj.head)) {
			global.map.headMap.set(key, value);
		}
	}
	onLoadPopulateHeadCreator(global.map.headMap);
}

function onLoadPopulateHeadCreator() {
	const wizardHeadTitle = global.id.wizardHeadTitle;
	const wizardHeadMetaDescription = global.id.wizardHeadMetaDescription;
	const wizardHeadMetaKeywords = global.id.wizardHeadMetaKeywords;
	const wizardHeadLinksDiv = global.id.wizardHeadDiv; // Assuming this is the container for links

	const headMap = Object.fromEntries(global.map.headMap);
	const title = headMap.title;
	const meta = headMap.meta;
	const links = headMap.link;

	if (title) wizardHeadTitle.value = title;

	if (meta) {
		const metaDescription = meta.find(
			(meta) => meta.name === "description",
		)?.content;
		const metaKeywords = meta.find((meta) => meta.name === "keywords")?.content;

		if (metaDescription) wizardHeadMetaDescription.value = metaDescription;
		if (metaKeywords) wizardHeadMetaKeywords.value = metaKeywords;
	}

	if (links) {
		//create title h4
		const title = document.createElement("h4");
		title.textContent = "Links";
		wizardHeadLinksDiv.appendChild(title);
		links.forEach((link, index) => {
			const linkDiv = document.createElement("div");
			linkDiv.classList.add("linkDiv");

			const relLabel = document.createElement("label");
			relLabel.textContent = "rel";
			const relInput = document.createElement("input");
			relInput.type = "text";
			relInput.value = link.rel ? link.rel : "";
			relInput.id = `link-${index}-rel`;

			const hrefLabel = document.createElement("label");
			hrefLabel.textContent = "href";
			const hrefInput = document.createElement("input");
			hrefInput.type = "text";
			hrefInput.value = link.href ? link.href : "";
			hrefInput.id = `link-${index}-href`;

			const typeLabel = document.createElement("label");
			typeLabel.textContent = "type";
			const typeInput = document.createElement("input");
			typeInput.type = "text";
			typeInput.value = link.type ? link.type : "";
			typeInput.id = `link-${index}-type`;

			linkDiv.appendChild(relLabel);
			linkDiv.appendChild(relInput);
			linkDiv.appendChild(hrefLabel);
			linkDiv.appendChild(hrefInput);
			linkDiv.appendChild(typeLabel);
			linkDiv.appendChild(typeInput);

			wizardHeadLinksDiv.appendChild(linkDiv);
		});
	}
}
