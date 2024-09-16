import populateContextSelectAll from "./populateContextSelectAll.js";

/**
 * @param {Map<string,string> | undefined} mapContextual
 */
export default function resolveToggleContext(mapContextual) {
  const stateSelectAllValue = global.id.stateSelectAll.value;
  const contextSelectAllDiv = global.id.contextSelectAllDiv;
  const stateOfContextSelectAllDiv = global.id.stateOfContextSelectAllDiv;
  if (stateSelectAllValue === "has") {
    contextSelectAllDiv.style.display = "flex";
    stateOfContextSelectAllDiv.style.display = "flex";
    if (mapContextual) populateContextSelectAll(mapContextual);
  } else {
    contextSelectAllDiv.style.display = "none";
    stateOfContextSelectAllDiv.style.display = "none";
  }
}
