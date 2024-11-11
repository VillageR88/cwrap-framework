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
		.then((jsonObj) => {
			for (const [key, value] of Object.entries(jsonObj)) {
				if (key !== "name") continue;
				templatesMap.set(value, jsonObj);
			}
		})
		.catch((error) => {
			console.error("Error loading templates source:", error);
		});
}
