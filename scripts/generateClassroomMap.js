/**
 * @typedef {import('./types.js').JsonObject} JsonObject
 */
/**
 * Creates classroomMap by merging two JSON objects.
 * @param {JsonObject} jsonObj1 - The first JSON object representing the element.
 * @param {JsonObject} jsonObj2 - The second JSON object representing the element.
 */
export default function generateClassroomMap(jsonObj1, jsonObj2) {
    const classroomMap = global.map.classroomMap;
    classroomMap.clear();

    const mergeClassroom = (jsonObj) => {
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
    };

    // Merge classrooms from both JSON objects
    mergeClassroom(jsonObj1);
    mergeClassroom(jsonObj2);
}