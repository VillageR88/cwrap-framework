const headMap = global.map.headMap;

export default function creatorSaveHead() {
	headMap.set("title", global.id.wizardHeadTitle.value);
	for (const value of Object.values(headMap.get("meta"))) {
		if (value.name === "description") {
			value.content = global.id.wizardHeadMetaDescription.value;
		}
		if (value.name === "keywords") {
			value.content = global.id.wizardHeadMetaKeywords.value;
		}
	}
}
