import getElementFromPath from "./getElementFromPath.js";

export default function populateBlueprintStyleOptionsValue(isState = false) {
  const blueprintStyleSelectValue = isState
    ? global.id.stateBlueprintPropertySelect.value
    : global.id.blueprintPropertySelect.value;
  const blueprintStyleInput = isState
    ? global.id.blueprintStatePropertyInput
    : global.id.propertyBlueprintInput;
  blueprintStyleInput.value = "";
  const blueprintMap = global.map.blueprintMap;
  const selector = getElementFromPath().timeStamp;
  const currentMap = blueprintMap.get(selector);
  const selectedBlueprintElement = global.id.blueprintSelect.value;
  const selectedBlueprintElementTrimmed = selectedBlueprintElement
    .replace(">", "")
    .trim();

  function getTargetElement(map, elementPath) {
    console.log("map", map);
    console.log("elementPath", elementPath);
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
        console.log("matchingChildren", matchingChildren);

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

  function getAppliedProperty(styles, property) {
    if (styles) {
      const styleArray = styles.split(";");
      for (const style of styleArray) {
        const [prop, value] = style.split(":");
        if (prop.trim() === property.trim()) {
          return value?.trim();
        }
      }
    }
    return "";
  }

  if (isState) {
    if (targetElement?.extend && Array.isArray(targetElement.extend)) {
      for (const extension of targetElement.extend) {
        if (
          extension.style &&
          typeof extension.style === "string" &&
          extension.extension === global.id.elementBlueprintStateSelect.value
        ) {
          const value = getAppliedProperty(extension.style, blueprintStyleSelectValue);
          if (value) {
            blueprintStyleInput.value = value;
            return;
          }
        }
      }
    }
  } else {
    let value = "";

    if (global.id.navAdditionalScreen.classList.contains("screenDesktop")) {
      console.log("Screen Size: Desktop");
      value = getAppliedProperty(targetElement?.style, blueprintStyleSelectValue);
    } else if (global.id.navAdditionalScreen.classList.contains("screenTablet")) {
      console.log("Screen Size: Tablet");
      const mediaQuery = targetElement?.mediaQueries?.find(
        (mq) => mq.query === "max-width: 768px"
      );
      value = getAppliedProperty(mediaQuery?.style, blueprintStyleSelectValue);
    } else if (global.id.navAdditionalScreen.classList.contains("screenMobile")) {
      console.log("Screen Size: Mobile");
      const mediaQuery = targetElement?.mediaQueries?.find(
        (mq) => mq.query === "max-width: 640px"
      );
      value = getAppliedProperty(mediaQuery?.style, blueprintStyleSelectValue);
    } else if (global.id.navAdditionalScreen.classList.contains("screenCustom")) {
      console.log("Screen Size: Custom");
      const mediaQuery = targetElement?.mediaQueries?.find(
        (mq) => mq.query === global.id.navScreenCustom.value
      );
      value = getAppliedProperty(mediaQuery?.style, blueprintStyleSelectValue);
    }

    if (value) {
      blueprintStyleInput.value = value;
    }
  }
}