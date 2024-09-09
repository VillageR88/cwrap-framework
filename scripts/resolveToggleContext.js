import populateContextSelectAll from "./populateContextSelectAll.js";

/**
 * @param {Map<string,string> | undefined} mapContextual
 */
export default function resolveToggleContext(mapContextual) {
  const stateSelectAllValue = document.getElementById("stateSelectAll").value;
  const contextSelectAllDiv = document.getElementById("contextSelectAllDiv");
  const stateOfContextSelectAllDiv = document.getElementById("stateOfContextSelectAllDiv");
  if (stateSelectAllValue === "has") {
    contextSelectAllDiv.style.display = "flex";
    stateOfContextSelectAllDiv.style.display = "flex";
    if (mapContextual) populateContextSelectAll(mapContextual);
  } else {
    contextSelectAllDiv.style.display = "none";
    stateOfContextSelectAllDiv.style.display = "none";
  }
}
