export default function populateContextSelectAll(mapContextual) {
  const selectContext = document.getElementById("selectContext");
  selectContext.innerHTML = "";
  for (const [key, value] of mapContextual) {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = key;
    selectContext.appendChild(option);
  }
}
