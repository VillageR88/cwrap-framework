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
            templatesMap.clear(); // Clear the existing map
            for (const template of jsonArray) {
                templatesMap.set(template.name, template);
            }
        })
        .catch((error) => {
            console.error("Error loading templates source:", error);
        });
}