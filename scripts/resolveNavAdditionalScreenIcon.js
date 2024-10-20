export default function resolveNavAdditionalScreenIcon() {
	const navAdditionalScreen = global.id.navAdditionalScreen;
	const desktopSVG = `<svg xmlns="http://www.w3.org/2000/svg"	height="24px" width="24px"><use href="#iconDesktop" /></svg>`;
	const tabletSVG = `<svg xmlns="http://www.w3.org/2000/svg"	height="24px" width="24px"><use href="#iconTablet" /></svg>`;
	const mobileSVG = `<svg xmlns="http://www.w3.org/2000/svg"	height="24px" width="24px"><use href="#iconMobile" /></svg>`;
	if (navAdditionalScreen.classList.contains("screenDesktop")) {
		navAdditionalScreen.innerHTML = desktopSVG;
	} else if (navAdditionalScreen.classList.contains("screenTablet")) {
		navAdditionalScreen.innerHTML = tabletSVG;
	} else if (navAdditionalScreen.classList.contains("screenMobile")) {
		navAdditionalScreen.innerHTML = mobileSVG;
	}
}
