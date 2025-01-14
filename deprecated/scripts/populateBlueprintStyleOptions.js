import getElementFromPath from "./getElementFromPath.js";

export default function populateBlueprintStyleOptions(isState = false) {
  const blueprintStyleSelect = isState
    ? global.id.stateBlueprintPropertySelect
    : global.id.blueprintPropertySelect;
  blueprintStyleSelect.innerHTML = "";
  const blueprintMap = global.map.blueprintMap;
  const selector = getElementFromPath().timeStamp;
  const currentMap = blueprintMap.get(selector);
  console.log("Current Map:", currentMap);
  const selectedBlueprintElement = global.id.blueprintSelect.value;
  const selectedBlueprintElementTrimmed = selectedBlueprintElement
    .replace(">", "")
    .trim();
  console.log("Selected Blueprint Element Trimmed:", selectedBlueprintElementTrimmed);

  function getTargetElement(map, elementPath) {
    console.log("Map:", map);
    console.log("Element Path:", elementPath);
    const pathParts = elementPath.split(" > ");
    let currentElement = map;

    for (const part of pathParts) {
      const [elementName, nthOfType] = part.split(":nth-of-type(");
      const index = nthOfType
        ? Number.parseInt(nthOfType.replace(")", ""), 10) - 1
        : 0;

      if (currentElement.children) {
        const matchingChildren = currentElement.children.filter(
          (child) => child.element === elementName
        );
        console.log("Matching Children:", matchingChildren);

        if (matchingChildren.length > index) {
          currentElement = matchingChildren[index];
        }
      }
    }

    return currentElement;
  }

  const targetElement = getTargetElement(
    currentMap,
    selectedBlueprintElementTrimmed
  );
  console.log("Target Element:", targetElement);

  function addStylesToSelect(styles) {
    for (const style of styles) {
      const [property] = style.split(":");
      if (property.trim()) {
        const newOption = new Option(property.trim(), property.trim());
        blueprintStyleSelect.appendChild(newOption);
      }
    }
  }

  function addMediaQueryStyles(mediaQueries, screenSize) {
    console.log("Adding Media Query Styles for Screen Size:", screenSize);
    const queries = mediaQueries || [];
    const mediaQuery = queries.find(
      (mq) => mq.query === screenSize
    );
    console.log("Media Query Found:", mediaQuery);
    if (mediaQuery?.style) {
      const styles = mediaQuery.style.split(";");
      addStylesToSelect(styles);
    } else {
      console.log(`No media query styles found for screen size: ${screenSize}`);
      // Create an empty media query entry if it doesn't exist
      if (!mediaQuery) {
        queries.push({ query: screenSize, style: "" });
        console.log(`Created empty media query for screen size: ${screenSize}`);
      }
    }
  }

  if (isState) {
    if (targetElement?.extend && Array.isArray(targetElement.extend)) {
      for (const extension of targetElement.extend) {
        console.log("Extension:", extension);
        if (
          extension.style &&
          typeof extension.style === "string" &&
          extension.extension === global.id.elementBlueprintStateSelect.value // this is bad choice for check is current extension is for current state
        ) {
          console.log("Extension Style:", extension.style);
          const styles = extension.style.split(";");
          addStylesToSelect(styles);
        }
      }
    }
  } else {
    let stylesAdded = false;

    if (global.id.navAdditionalScreen.classList.contains("screenDesktop")) {
      console.log("Screen Size: Desktop");
      if (targetElement?.style && typeof targetElement.style === "string") {
        console.log("Adding Default Styles");
        const styles = targetElement.style.split(";");
        addStylesToSelect(styles);
        stylesAdded = true;
      }
    } else if (global.id.navAdditionalScreen.classList.contains("screenTablet")) {
      console.log("Screen Size: Tablet");
      addMediaQueryStyles(targetElement.mediaQueries, "max-width: 768px");
      stylesAdded = true;
    } else if (global.id.navAdditionalScreen.classList.contains("screenMobile")) {
      console.log("Screen Size: Mobile");
      addMediaQueryStyles(targetElement.mediaQueries, "max-width: 640px");
      stylesAdded = true;
    } else if (global.id.navAdditionalScreen.classList.contains("screenCustom")) {
      console.log("Screen Size: Custom");
      addMediaQueryStyles(targetElement.mediaQueries, global.id.navScreenCustom.value);
      stylesAdded = true;
    } else {
      console.log("No matching screen size found.");
    }

    if (!stylesAdded && targetElement?.mediaQueries && Array.isArray(targetElement.mediaQueries)) {
      console.log("No media queries found for target element.");
      // Create empty media query entries for common screen sizes
      targetElement.mediaQueries = targetElement.mediaQueries || [];
      addMediaQueryStyles(targetElement.mediaQueries, "max-width: 1200px");
      addMediaQueryStyles(targetElement.mediaQueries, "max-width: 768px");
      addMediaQueryStyles(targetElement.mediaQueries, "max-width: 640px");
    }
  }
}