import getAlter from "./getAlter.js";

export default function addBlueprintAlterStyleOption() {
  const alter = getAlter();
  if (!alter.enumReference) {
    alter.enumReference = {};
  }
  if (!alter.enumReference.style) {
    alter.enumReference.style = "";
  }
  /** @type {Record<string, string>} */
  const styleObject = Object.fromEntries(
    alter.enumReference.style
      .split(";")
      .filter(Boolean)
      .map((item) => {
        const key = item.match(/^.+(?=:)/)[0].trim();
        const value = item.match(/(?<=:).+/)[0].trim();
        return [key, value];
      })
  );
  styleObject[
    global.id.mainBlueprintAlterStyleSelectorStyleAddPropertyBlueprintSelectAll.value
  ] = "";
  const styleString = Object.entries(styleObject)
    .map(([key, value]) => `${key}: ${value}`)
    .join("; ")
    .concat(";");
  alter.enumReference.style = styleString;
}
