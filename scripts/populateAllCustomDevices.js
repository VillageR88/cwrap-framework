/**
 * @todo Add skeleton json media queries to config if not present and excluding default media queries, and present already. This way we don't end in situation query is applied without any clue or gui access.
 */
export default function populateAllCustomDevices() {
	const navScreenCustom = document.getElementById("navScreenCustom");

	for (const item of [
		"🔧 manage devices ",
		...global.localSettings.customDevices,
	]) {
		const option = document.createElement("option");
		option.value = navScreenCustom.length === 0 ? "cwrapManageCustomDevices" : item;
		option.textContent = item;
		navScreenCustom.append(option);
	}
	navScreenCustom.value = "";
}
