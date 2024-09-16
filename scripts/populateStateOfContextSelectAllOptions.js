import { stateNonContextual } from "./_const.js";

export default function populateStateOfContextSelectAllOptions() {
  const selectStateOfContext = global.id.selectStateOfContext;
  selectStateOfContext.innerHTML = "";
  for (const element of stateNonContextual) {
    const option = document.createElement("option");
    option.value = element;
    option.textContent = element;
    selectStateOfContext.appendChild(option);
  }
}
