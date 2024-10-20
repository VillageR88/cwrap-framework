export default function resolveNavSelectPreview() {
	const navSelectPreview = global.id.navSelectPreview;
	const previewSVG = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" width="24px"><use href="#iconPreview" /></svg>`;
	const staticSVG = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" width="24px"><use href="#iconStatic" /></svg>`;
	const treeSVG = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" width="24px"><use href="#iconTree" /></svg>`;
	if (navSelectPreview.classList.contains("preview")) {
		navSelectPreview.innerHTML = previewSVG;
	} else if (navSelectPreview.classList.contains("static")) {
		navSelectPreview.innerHTML = staticSVG;
	} else if (navSelectPreview.classList.contains("tree")) {
		navSelectPreview.innerHTML = treeSVG;
	}
}
