const templatesApiUrl = "routes/templates.json";
const templatesMap = global.map.templatesMap;

export default function loadTemplatesSource() {
    const url = `${templatesApiUrl}?v=${new Date().getTime()}`;
    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((jsonArray) => {
            templatesMap.clear();
            for (const template of jsonArray) {
                templatesMap.set(template.name, template);
            }
        })
        .catch((error) => {
            console.info("%c\u200Binfo: no templates source found", "color:skyBlue");
            templatesMap.clear();
        });
}