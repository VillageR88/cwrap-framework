export default function checkIfBlueprintEnvironment() {
	const isBlueprint =
		global.id.mainBlueprintSelector.style.display === "flex" ||
		global.id.mainBlueprintStyleSelector.style.display === "flex" ||
		global.id.mainBlueprintStyleAdd.style.display === "flex" ||
		global.id.mainBlueprintStateSelector.style.display === "flex" ||
		global.id.mainBlueprintStateAdd.style.display === "flex";
	return isBlueprint;
}
