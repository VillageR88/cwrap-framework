/**
 * @typedef {import('./types.js').JsonObject} JsonObject
 */
/**
 * Creates classroomMap.
 * @param {JsonObject} jsonObj - The JSON object representing the element.
 */
export default function generateClassroomMap(jsonObj) {
	const classroomMap = global.map.classroomMap;
    classroomMap.clear();
	for (const [key, value] of Object.entries(jsonObj.classroom)) {
        classroomMap.set(key, value);
	}
}
