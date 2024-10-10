export default function resolveElementStateSelect() {
	if (global.id.elementStateSelect.value.includes(":has")) {
		console.log("resolveElementStateSelect");
		global.id.mainStateStyleContextInfo.style.display = "flex";
		global.id.stateContextInfo.value = global.id.elementStateSelect.value
			.split(":has")[1]
			.slice(1, -1);
		global.id.stateContextInfo.title = global.id.elementStateSelect.value;
		global.id.stateContextInfo.scrollLeft = 0;
	} else {
        global.id.mainStateStyleContextInfo.style.display = "none";
        global.id.stateContextInfo.value = "";
        global.id.stateContextInfo.title = "";
        global.id.stateContextInfo.scrollLeft = 0;
	}
}
