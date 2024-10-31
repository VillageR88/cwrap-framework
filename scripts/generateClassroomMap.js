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
	if (!jsonObj.classroom) {
		return;
	}
	for (const [key, value] of Object.entries(jsonObj.classroom)) {
		// Ensure mediaQueries is an array if it exists
		if (value.mediaQueries && !Array.isArray(value.mediaQueries)) {
			value.mediaQueries = [value.mediaQueries];
		}
		classroomMap.set(key, value);
	}
}
