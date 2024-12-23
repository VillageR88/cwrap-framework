/**
 * @typedef {import('./types.js').JsonObject} JsonObject
 */
/**
 * Creates classroomMap.
 * @param {JsonObject} jsonObj1 - The first JSON object representing the element.
 * @param {JsonObject} jsonObj2 - The second JSON object representing the element.
 */
export default function generateClassroomMap(jsonObj1, jsonObj2) {
  const classroomMap = global.map.classroomMap;
  classroomMap.clear();

  const combinedClassroom = jsonObj1?.classroom.concat(jsonObj2?.classroom);

  for (const [key, value] of Object.entries(combinedClassroom)) {
    if (value.mediaQueries && !Array.isArray(value.mediaQueries)) {
      value.mediaQueries = [value.mediaQueries];
    }
    classroomMap.set(key, value);
  }
}
