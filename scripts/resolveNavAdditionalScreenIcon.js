export default function resolveNavAdditionalScreenIcon() {
	const colorFill = document.documentElement.style.getPropertyValue(
		"--colorFill-regular",
	);
	const navAdditionalScreen = global.id.navAdditionalScreen;
	const desktopSVG = `<svg xmlns="http://www.w3.org/2000/svg"	height="24px" width="24px"><use href="#iconDesktop" /></svg>`;
	const tabletSVG = `<svg xmlns="http://www.w3.org/2000/svg"	height="24px" width="24px"><use href="#iconTablet" /></svg>`;
	const mobileSVG = `<svg xmlns="http://www.w3.org/2000/svg"	height="24px" width="24px"><use href="#iconMobile" /></svg>`;
	const customSVG = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="${colorFill}"><path d="M280-160H160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640v80H160v480h120v80Zm160-100q25 0 42.5-17.5T500-320q0-25-17.5-42.5T440-380q-25 0-42.5 17.5T380-320q0 25 17.5 42.5T440-260Zm-80 100v-71q-19-17-29.5-40T320-320q0-26 10.5-49t29.5-40v-71h160v71q19 17 29.5 40t10.5 49q0 26-10.5 49T520-231v71H360Zm480 0H640q-17 0-28.5-11.5T600-200v-360q0-17 11.5-28.5T640-600h200q17 0 28.5 11.5T880-560v360q0 17-11.5 28.5T840-160Zm-160-80h120v-280H680v280Zm0 0h120-120Z"/></svg>`
	if (navAdditionalScreen.classList.contains("screenDesktop")) {
		navAdditionalScreen.innerHTML = desktopSVG;
	} else if (navAdditionalScreen.classList.contains("screenTablet")) {
		navAdditionalScreen.innerHTML = tabletSVG;
	} else if (navAdditionalScreen.classList.contains("screenMobile")) {
		navAdditionalScreen.innerHTML = mobileSVG;
	}  else if (navAdditionalScreen.classList.contains("screenCustom")) {
		navAdditionalScreen.innerHTML = customSVG;
	}
}
