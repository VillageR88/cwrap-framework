export default function checkIfAlterEnvironment() {
	const isAlter = global.id.mainBlueprintAlterSelector.style.display === "flex";
	return isAlter;
}
