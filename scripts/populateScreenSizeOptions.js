const ELEMENT_SELECT_ID = "elementSelect";
const RESPONSIVE_SELECT_ID = "responsiveSelect";

/**
 * Populates the Screen Size options based on the selected element.
 * @todo Refactor this function to be more efficient I also did a quite a battle making this work and now all these element select by id can be changed
 * @param {Map} mediaQueriesMap
 */
export default function populateScreenSizeOptions(mediaQueriesMap) {
  const elementSelect = document.getElementById(ELEMENT_SELECT_ID);
  const responsiveSelect = document.getElementById(RESPONSIVE_SELECT_ID);
  const responsiveSelectMemory = responsiveSelect.value;
  responsiveSelect.innerHTML = "any";
  responsiveSelect.appendChild(new Option("any"));
  for (const [screenSize, queries] of mediaQueriesMap.entries()) {
    const newScreenSizeOption = document.createElement("option");
    newScreenSizeOption.textContent = screenSize;
    for (const [key, value] of queries) {
      if (elementSelect.value === key) {
        responsiveSelect.appendChild(newScreenSizeOption);
      }
    }
  }
  if (
    Array.from(responsiveSelect.options).some(
      (option) => option.value === responsiveSelectMemory
    )
  ) {
    responsiveSelect.value = responsiveSelectMemory;
  } else {
    responsiveSelect.value = "any";
  }
}
