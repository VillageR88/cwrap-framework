const templatesApiUrl = "../routes/templates.json";
const templatesMap = global.map.templatesMap;

export default async function loadTemplatesSource() {
    const url = `${templatesApiUrl}?v=${new Date().getTime()}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonArray = await response.json();
        templatesMap.clear();
        for (const template of jsonArray) {
            templatesMap.set(template.name, template);
        }
    } catch (error) {
        console.info("%c\u200Binfo: no templates source found", "color:skyBlue");
        templatesMap.clear();
    }
}