export function loadHeadView() {
	global.id.mainBody.style.display = "none";
	global.id.preview.style.display = "none";
	global.id.noPreview.style.display = "none";
	global.id.styleRow.style.display = "flex";
	global.id.wizardDiv.style.display = "flex";
	global.id.wizardTitle.textContent = "Head creator";
	global.id.wizardHeadDiv.style.display = "flex";
	global.id.wizardFontsDiv.style.display = "none";
	global.id.wizardRootDiv.style.display = "none";
	global.id.wizard.classList.remove(global.class.shaded);
	global.id.leftSidebar.classList.add(global.class.smaller);
}

export function loadFontsView() {
	global.id.mainBody.style.display = "none";
	global.id.preview.style.display = "none";
	global.id.noPreview.style.display = "none";
	global.id.styleRow.style.display = "flex";
	global.id.wizardDiv.style.display = "flex";
	global.id.wizardTitle.textContent = "Fonts creator";
	global.id.wizardHeadDiv.style.display = "none";
	global.id.wizardFontsDiv.style.display = "flex";
	global.id.wizardRootDiv.style.display = "none";
	global.id.wizard.classList.add(global.class.shaded);
	global.id.leftSidebar.classList.add(global.class.smaller);
}

export function loadRootView() {
	global.id.mainBody.style.display = "none";
	global.id.preview.style.display = "none";
	global.id.noPreview.style.display = "none";
	global.id.styleRow.style.display = "flex";
	global.id.wizardDiv.style.display = "flex";
	global.id.wizardTitle.textContent = "Root creator";
	global.id.wizardHeadDiv.style.display = "none";
	global.id.wizardFontsDiv.style.display = "none";
	global.id.wizardRootDiv.style.display = "flex";
	global.id.wizard.classList.add(global.class.shaded);
	global.id.leftSidebar.classList.add(global.class.smaller);
}

export function loadBodyView() {
	global.id.mainBody.style.display = "flex";
	global.id.preview.style.display = "flex";
	global.id.noPreview.style.display = "none";
	global.id.styleRow.style.display = "none";
	global.id.wizardDiv.style.display = "none";
	global.id.leftSidebar.classList.remove(global.class.smaller);
}
