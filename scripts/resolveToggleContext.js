import populateContextSelectAll from "./populateContextSelectAll.js";

/**
 * @param {Map<string,string> | undefined} mapContextual
 */
export default function resolveToggleContext(mapContextual) {
  const stateSelectAllValue = global.id.stateSelectAll.value;
  const selectContext = global.id.selectContext;
  const selectContextHighlight = global.id.selectContextHighlight;
  const selectStateOfContext = global.id.selectStateOfContext;
  if (stateSelectAllValue === "has") {
    selectStateOfContext.style.display = "flex";
    selectContext.style.display = "flex";
    selectContextHighlight.style.display = "flex";
    if (mapContextual) populateContextSelectAll(mapContextual);
  } else {
    selectStateOfContext.style.display = "none";
    selectContext.style.display = "none";
    selectContextHighlight.style.display = "none";
  }
}
