export default function populateClassroomSelectName(selectedName = null) {
	const selectedType = global.id.mainClassroomSelectorSelectType.value;
	const classroomMap = global.map.classroomMap;
	const mainClassroomSelectorSelectName =
		global.id.mainClassroomSelectorSelectName;
	mainClassroomSelectorSelectName.innerHTML = "";

	for (const [key, classroom] of classroomMap.entries()) {
		if (classroom.type === selectedType) {
			const option = document.createElement("option");
			option.value = classroom.name;
			option.textContent = classroom.name;
			mainClassroomSelectorSelectName.appendChild(option);
		}
	}

	if (selectedName) {
		mainClassroomSelectorSelectName.value = selectedName;
	}
}
