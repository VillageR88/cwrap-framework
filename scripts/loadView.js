import resolveNavAdditionalScreenIcon from "./resolveNavAdditionalScreenIcon.js";
import resolveNavSelectPreview from "./resolveNavSelectPreview.js";

/**
 * @type {import("./_globals")}
 */
export function loadHeadView() {
	// global.id.leftSidebarAddition.style.display = "none";
	global.id.selectedElementLabelContainer.style.display = "none";
	global.id.navBodyAdditional.style.display = "none";
	global.id.navDevice.style.display = "none";
	global.id.navPreview.style.display = "none";
	global.id.preview.style.display = "none";
	global.id.previewTree.style.display = "none";
	global.id.wizardDiv.style.display = "flex";
	global.id.wizardTitle.textContent = "Head creator";
	global.id.wizardHeadDiv.style.display = "flex";
	global.id.wizardFontsDiv.style.display = "none";
	global.id.wizardRootDiv.style.display = "none";
	global.id.wizard.classList.remove(global.class.shaded);
	leftSidebarCleanup();
	centralBarCleanup();
}

export function loadFontsView() {
	// global.id.leftSidebarAddition.style.display = "none";
	global.id.selectedElementLabelContainer.style.display = "none";
	global.id.navBodyAdditional.style.display = "none";
	global.id.navDevice.style.display = "none";
	global.id.navPreview.style.display = "none";
	global.id.preview.style.display = "none";
	global.id.previewTree.style.display = "none";
	global.id.wizardDiv.style.display = "flex";
	global.id.wizardTitle.textContent = "Fonts creator";
	global.id.wizardHeadDiv.style.display = "none";
	global.id.wizardFontsDiv.style.display = "flex";
	global.id.wizardRootDiv.style.display = "none";
	global.id.wizard.classList.add(global.class.shaded);
	leftSidebarCleanup();
	centralBarCleanup();
}

export function loadRootView() {
	// global.id.leftSidebarAddition.style.display = "none";
	global.id.selectedElementLabelContainer.style.display = "none";
	global.id.navBodyAdditional.style.display = "none";
	global.id.navDevice.style.display = "none";
	global.id.navPreview.style.display = "none";
	global.id.preview.style.display = "none";
	global.id.previewTree.style.display = "none";
	global.id.wizardDiv.style.display = "flex";
	global.id.wizardTitle.textContent = "Root creator";
	global.id.wizardHeadDiv.style.display = "none";
	global.id.wizardFontsDiv.style.display = "none";
	global.id.wizardRootDiv.style.display = "flex";
	global.id.wizard.classList.add(global.class.shaded);
	leftSidebarCleanup();
	centralBarCleanup();
}

export function loadBodyView() {
	// global.id.leftSidebarAddition.style.display = "flex";
	global.id.navLvlMenu.style.display = "none";
	global.id.navLvlRoute.style.display = "flex";
	global.id.selectedElementLabelContainer.style.display = "flex";
	global.id.navAdditionalScreen.style.display = "flex";
	global.id.navBodyAdditional.style.display = "flex";
	global.id.navDevice.style.display = "none";
	global.id.navPreview.style.display = "none";
	global.id.preview.style.display = "flex";
	global.id.previewTree.style.display = "none";
	global.id.wizardDiv.style.display = "none";
	global.id.wizardTitle.textContent = "Wizard title";

	// global.id.leftSidebar.classList.remove(global.class.smaller); //debug
	leftSidebarCleanup();
	centralBarCleanup();
	resolveNavAdditionalScreenIcon();
	resolveNavSelectPreview();
}

export function loadRoutesView() {
	global.id.routesTree.style.display = "flex";
	global.id.settingsTree.style.display = "none";
}

export function loadSettingsView() {
	global.id.routesTree.style.display = "none";
	global.id.settingsTree.style.display = "flex";
}

export function loadThemesView() {
	global.id.routesTree.style.display = "none";
	global.id.settingsTree.style.display = "none";
}

export function loadMenuLevelView() {
	global.id.navLvlRoute.style.display = "none";
	global.id.selectedElementLabelContainer.style.display = "none";
	global.id.navBodyAdditional.style.display = "none";
	global.id.preview.style.display = "none";
	global.id.navSections.style.display = "none";
	global.id.navLvlMenu.style.display = "flex";
	global.id.navSelection.style.display = "flex";
	global.id.previewTree.style.display = "none";
	global.id.wizardDiv.style.display = "none";
}

function leftSidebarCleanup() {
	global.id.navSelectPreview.classList.remove("tree", "static");
	global.id.navSelectPreview.classList.add("preview");
}

function centralBarCleanup() {
	global.id.mainInitialSelector.style.display = "flex";
	global.id.selectedElementHighlight.style.display = "flex";
	global.id.mainElementAdd.style.display = "none";
	global.id.mainTextEditor.style.display = "none";
	global.id.mainTextEditor2.style.display = "none";
	global.id.mainAttributeAdd.style.display = "none";
	global.id.mainAttributeSelector.style.display = "none";
	global.id.mainAttributeSelector2.style.display = "none";
	global.id.mainStyleAdd.style.display = "none";
	global.id.mainStyleSelector.style.display = "none";
	global.id.mainStyleSelector2.style.display = "none";
	global.id.mainStateSelector.style.display = "none";
	global.id.mainStateAdd.style.display = "none";
	global.id.mainStateStyleSelector.style.display = "none";
	global.id.mainStateStyleSelector2.style.display = "none";
}
