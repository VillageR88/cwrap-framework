export default function updatePropertySelectOptions(isState) {
  const fullPath = isState
    ? global.id.elementStateSelect.value
    : global.id.elementSelect.value;
  const cssMap = global.map.cssMap;
  const mediaQueriesMap = global.map.mediaQueriesMap;
  const propertySelect = isState
    ? global.id.statePropertySelect
    : global.id.propertySelect;

  // Determine the current screen
  const currentScreen = getCurrentScreen(global.id.navAdditionalScreen);

  // Retrieve the current style based on the current screen
  let currentStyle = "";
  if (currentScreen === "screenDesktop") {
    currentStyle = cssMap.get(fullPath) || "";
  } else if (currentScreen === "screenTablet") {
    currentStyle = mediaQueriesMap.get("max-width: 768px")?.get(fullPath) || "";
  } else if (currentScreen === "screenMobile") {
    currentStyle = mediaQueriesMap.get("max-width: 640px")?.get(fullPath) || "";
  } else if (currentScreen === "screenCustom") {
    currentStyle = mediaQueriesMap.get(global.id.navScreenCustom.value)?.get(fullPath) || "";
  }

  const styleProperties = currentStyle
    .split(";")
    .filter(Boolean)
    .map((prop) => prop.trim());

  propertySelect.innerHTML = "";
  for (const prop of styleProperties) {
    const [key] = prop.split(":").map((item) => item.trim());
    const option = document.createElement("option");
    option.value = key;
    option.textContent = key;
    propertySelect.appendChild(option);
  }

  const propertyInput = global.id.propertyInput;
  const selectedProperty = propertySelect.value;
  const selectedValue =
    styleProperties.length > 0
      ? styleProperties
          .find((prop) => prop.startsWith(selectedProperty))
          .split(":")[1]
          .trim()
      : "";
  propertySelect.value = selectedProperty;
  propertyInput.value = selectedValue;
}

// Define the reusable function
function getCurrentScreen(navAdditionalScreen) {
  if (navAdditionalScreen.classList.contains("screenDesktop")) {
    return "screenDesktop";
  } else if (navAdditionalScreen.classList.contains("screenTablet")) {
    return "screenTablet";
  } else if (navAdditionalScreen.classList.contains("screenMobile")) {
    return "screenMobile";
  } else if (navAdditionalScreen.classList.contains("screenCustom")) {
    return "screenCustom";
  }
  return null; // Return null if no matching class is found
}
