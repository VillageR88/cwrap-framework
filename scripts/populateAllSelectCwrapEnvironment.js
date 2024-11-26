export default function populateAllSelectCwrapEnvironment() {
	const navScreenCustom = document.getElementById("navScreenCustom");
	for (const item of ["🔧 manage devices "]) {
		const option = document.createElement("option");
		option.value = item;
		option.textContent = item;
		navScreenCustom.append(option);
	}
	navScreenCustom.value = "";
}
