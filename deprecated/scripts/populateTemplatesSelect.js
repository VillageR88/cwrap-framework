const mainTemplatesSelectorOptions = global.id.mainTemplatesSelectorOptions;
export default function populateTemplatesSelect() {
    mainTemplatesSelectorOptions.innerHTML = "";
    for (const [key, value] of global.map.templatesMap.entries()) {
        const option = document.createElement("option");
        option.value = key;
        option.textContent = key;
        mainTemplatesSelectorOptions.appendChild(option);
    }
}
