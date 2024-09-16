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
	if (jsonObj.head)
		for (const [key, value] of Object.entries(jsonObj.head)) {
			global.map.headMap.set(key, value);
		}
	onLoadPopulateHeadCreator(global.map.headMap);
}

function onLoadPopulateHeadCreator() {
	const wizardHeadTitle = document.getElementById("wizardHeadTitle");
	const wizardHeadMetaDescription = document.getElementById(
		"wizardHeadMetaDescription",
	);
	const wizardHeadMetaKeywords = document.getElementById(
		"wizardHeadMetaKeywords",
	);
	const title = Object.fromEntries(global.map.headMap).title;
	const meta = Object.fromEntries(global.map.headMap).meta;
	const metaDescription = meta.find(
		(meta) => meta.name === "description",
	).content;
	const metaKeywords = meta.find((meta) => meta.name === "keywords").content;
	if (title) wizardHeadTitle.value = title;
	if (metaDescription) wizardHeadMetaDescription.value = metaDescription;
	if (metaKeywords) wizardHeadMetaKeywords.value = metaKeywords;
}
