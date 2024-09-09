import resolveToggleContext from "./resolveToggleContext.js";
import { stateNonContextual } from "./_const.js";

const stateContextual = ["has"];

/**
 *
 * @param {Map<string,string>} cssMap
 * @param {Map<string,string>} mediaQueriesMap
 */
export default function populateStateSelectAllOptions(cssMap, mediaQueriesMap) {
  const stateOfText = document.getElementById("stateOf").textContent;
  /**
   * @type {Map<string,string>} statelessCssMap
   */
  const statelessCssMap = new Map();
  for (const [key, value] of cssMap) {
    if (key.includes(":has") || key.includes(":hover")) continue;
    statelessCssMap.set(key, value);
  }
  /**
   * @type {Map<string,string>} mapIncludesKey
   */
  const mapIncludesKey = new Map();
  for (const [key, value] of statelessCssMap) {
    if (key.includes(stateOfText)) mapIncludesKey.set(key, value);
  }
  /**
   * @type {Map<string,string>} keyInMapHasChildren
   */
  const keyInMapHasChildren = new Map();
  for (const [key, value] of mapIncludesKey) {
    if (key.replace(stateOfText, "").includes(">")) {
      keyInMapHasChildren.set(key, value);
    }
  }
  /**
   * @type {Map<string,string>} mapContextual
   */
  const mapContextual = new Map();
  for (const [key, value] of keyInMapHasChildren) {
    const newKey = key.replace(`${stateOfText} > `, "");
    mapContextual.set(newKey, value);
  }
  const stateSelectAll = document.getElementById("stateSelectAll");
  stateSelectAll.innerHTML = "";
  for (const element of stateContextual) {
    const option = document.createElement("option");
    option.value = element;
    option.textContent = element;
    stateSelectAll.appendChild(option);
  }
  for (const element of stateNonContextual) {
    const option = document.createElement("option");
    option.value = element;
    option.textContent = element;
    stateSelectAll.appendChild(option);
  }
  resolveToggleContext(mapContextual);
}
