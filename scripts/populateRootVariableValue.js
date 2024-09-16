export default function populateRootVariableValue(rootMap) {
	global.id.rootInput.value = rootMap.get(global.id.rootSelectVariable.value);
}
