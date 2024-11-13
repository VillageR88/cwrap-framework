const templatesApiUrl = "routes/templates.json";
const templatesMap = global.map.templatesMap;

export default function loadTemplatesSource() {
    fetch(templatesApiUrl)
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
            console.info("%c info: No templates source found, creating an empty map", "color:skyBlue");
            templatesMap.clear();
        });
}