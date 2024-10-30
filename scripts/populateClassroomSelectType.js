export default function populateClassroomSelectType(selectedType = "") {
	const classroomMap = global.map.classroomMap;
	const mainClassroomSelectorSelectType =
		global.id.mainClassroomSelectorSelectType;
	mainClassroomSelectorSelectType.innerHTML = "";
	const typeSet = new Set();
	for (const classroom of classroomMap.values()) {
		typeSet.add(classroom.type);
	}
	const typeArray = Array.from(typeSet);
	typeArray.sort();
	for (const type of typeArray) {
		const option = document.createElement("option");
		option.value = type;
		option.textContent = type;
		mainClassroomSelectorSelectType.appendChild(option);
	}
	if (selectedType) {
		mainClassroomSelectorSelectType.value = selectedType;
	}
}

/*
export default function populateClassroomSelectName() {
	console.log("populateClassroomSelectAll");
	const classroomMap = global.map.classroomMap;
	const mainClassroomSelectorSelectName =
		global.id.mainClassroomSelectorSelectName;
        mainClassroomSelectorSelectName.innerHTML = "";
	for (const classroom of classroomMap.values()) {
		const option = document.createElement("option");
		option.value = classroom.id;
		option.textContent = classroom.name;
		mainClassroomSelectorSelectName.appendChild(option);
	}
}
*/
