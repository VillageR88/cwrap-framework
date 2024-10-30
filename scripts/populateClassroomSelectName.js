export default function populateClassroomSelectName(selectedName = null) {
    console.log("selectedName", selectedName);
    console.log("populateClassroomSelectName");
    const selectedType = global.id.mainClassroomSelectorSelectType.value;
    const classroomMap = global.map.classroomMap;
    const mainClassroomSelectorSelectName =
        global.id.mainClassroomSelectorSelectName;
    mainClassroomSelectorSelectName.innerHTML = "";

    for (const [key, classroom] of classroomMap.entries()) {
        if (classroom.type === selectedType) {
            // Filter by selected type
            const option = document.createElement("option");
            option.value = key; // Use the key as the value
            option.textContent = classroom.name;
            mainClassroomSelectorSelectName.appendChild(option);
        }
    }
    if (selectedName) {
        mainClassroomSelectorSelectName.value = `${selectedType} ${selectedName}`;
    }
}