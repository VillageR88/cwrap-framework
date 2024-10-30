export default function populateClassroomSelectName() {
	const selectedType = global.id.mainClassroomSelectorSelectType.value;
	const classroomMap = global.map.classroomMap;
	const mainClassroomSelectorSelectName =
		global.id.mainClassroomSelectorSelectName;
	mainClassroomSelectorSelectName.innerHTML = "";

	for (const classroom of classroomMap.values()) {
		if (classroom.type === selectedType) {
			// Filter by selected type
			const option = document.createElement("option");
			option.value = classroom.id;
			option.textContent = classroom.name;
			mainClassroomSelectorSelectName.appendChild(option);
		}
	}
}
