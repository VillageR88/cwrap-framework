import getElementFromPath from "./getElementFromPath.js";

export default function populateBlueprintStyleOptions(isState = false) {
  const blueprintStyleSelect = isState
    ? global.id.stateBlueprintPropertySelect
    : global.id.blueprintPropertySelect;
  blueprintStyleSelect.innerHTML = "";
  const blueprintMap = global.map.blueprintMap;
  const selector = getElementFromPath().timeStamp;
  const currentMap = blueprintMap.get(selector);
  const selectedBlueprintElement = global.id.blueprintSelect.value;
  const selectedBlueprintElementTrimmed = selectedBlueprintElement
    .replace(">", "")
    .trim();
  console.log(selectedBlueprintElementTrimmed);
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

  if (isState) {
    if (targetElement?.extend && Array.isArray(targetElement.extend)) {
      for (const extension of targetElement.extend) {
        console.log(extension);
        if (
          extension.style &&
          typeof extension.style === "string" &&
          extension.extension === global.id.elementBlueprintStateSelect.value // this is bad choice for check is current extension is for current state
        ) {
          console.log(global.id.elementBlueprintStateSelect.value);
          console.log("extension.style", extension.style);
          const styles = extension.style.split(";");
          for (const style of styles) {
            const [property] = style.split(":");
            if (property.trim()) {
              const newOption = new Option(property.trim(), property.trim());
              blueprintStyleSelect.appendChild(newOption);
            }
          }
        }
      }
    }
  } else {
    if (targetElement?.style && typeof targetElement.style === "string") {
      // fixed for non State by deletion in this commit
      const styles = targetElement.style.split(";");
      for (const style of styles) {
        const [property] = style.split(":");
        if (property.trim()) {
          const newOption = new Option(property.trim(), property.trim());
          blueprintStyleSelect.appendChild(newOption);
        }
      }
    }
  }
}
