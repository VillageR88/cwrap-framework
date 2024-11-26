export default function populateAllCustomDevices() {
	const navScreenCustom = document.getElementById("navScreenCustom");

	for (const item of [
		"🔧 manage devices ",
		...global.localSettings.customDevices,
	]) {
		const option = document.createElement("option");
		console.log(navScreenCustom.length)
		option.value = navScreenCustom.length === 0 ? "cwrapManageCustomDevices" : item;
		option.textContent = item;
		navScreenCustom.append(option);
	}
	navScreenCustom.value = "";
}
