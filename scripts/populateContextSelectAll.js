export default function populateContextSelectAll(mapContextual) {
	console.log("mapContextual", mapContextual);
	const selectContext = global.id.selectContext;
	selectContext.innerHTML = "";
	for (const [key, value] of mapContextual) {
		const option = document.createElement("option");
		option.value = key;
		option.textContent = key;
		selectContext.appendChild(option);
	}
}
