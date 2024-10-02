export default function populatePropertyValue() {
    console.log('populatePropertyValue debugLog');
    const cssMap = global.map.cssMap;
    const propertyInput = global.id.propertyInput;
    const propertySelect = global.id.propertySelect.value; //trying to make it more modular WiP
    let selectedValue = "";
    const fullPath = global.id.elementSelect.value;
    const currentStyle = cssMap.get(fullPath) || "";
    const styleProperties = currentStyle
    .split(";")
    .map((prop) => prop.trim())
    .filter(Boolean);
    if (currentStyle)
        selectedValue =
            styleProperties.length > 0
                ? styleProperties
                        .find((prop) => prop.startsWith(propertySelect))
                        .split(":")[1]
                        .trim()
                : "";
    propertyInput.value = selectedValue;
}