const globalsApiUrl = "../routes/globals.json";
const globalsMap = global.map.globalsMap;

export default async function loadGlobalsSource() {
    const url = `${globalsApiUrl}?v=${new Date().getTime()}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonArray = await response.json();
        globalsMap.clear();
        for (const template of jsonArray) {
            globalsMap.set(template.name, template);
        }
    } catch (error) {
        console.info("%c\u200Binfo: no globals source found", "color:skyBlue");
        globalsMap.clear();
    }
}