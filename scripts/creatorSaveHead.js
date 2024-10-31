const headMap = global.map.headMap;

export default function creatorSaveHead() {
	headMap.set("title", global.id.wizardHeadTitle.value);

	const meta = headMap.get("meta") || [];
	const updatedMeta = meta.map((value) => {
		if (value.name === "description") {
			value.content = global.id.wizardHeadMetaDescription.value;
		}
		if (value.name === "keywords") {
			value.content = global.id.wizardHeadMetaKeywords.value;
		}
		return value;
	});
	headMap.set("meta", updatedMeta);

	const linksContainer = document.querySelector(".linksContainer");
	const links = [];
	if (linksContainer) {
		const linkDivs = linksContainer.querySelectorAll(".linkDiv");
		for (const linkDiv of linkDivs) {
			const relInput = linkDiv.querySelector("input[id*='rel']");
			const hrefInput = linkDiv.querySelector("input[id*='href']");
			const typeInput = linkDiv.querySelector("input[id*='type']");
			links.push({
				rel: relInput ? relInput.value : "",
				href: hrefInput ? hrefInput.value : "",
				type: typeInput ? typeInput.value : "",
			});
		}
	}
	headMap.set("link", links);
}
