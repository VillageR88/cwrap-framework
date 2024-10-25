export default function generateStageMap(jsonObj) {
    const stageMap = global.map.stageMap;

    if (jsonObj.stage) {
        for (const [key, value] of Object.entries(jsonObj.stage)) {
            stageMap.set(key, value);
        }
    }

    console.log(stageMap);
}