const version = document.getElementById("version");
const mobileNavButton = document.getElementById("mobile-nav-button") as
	| HTMLButtonElement
	| undefined;
const nav = document.getElementById("aside-documents") as
	| HTMLElement
	| undefined;
const documentation = document.getElementById("documentation-container") as
	| HTMLDivElement
	| undefined;

window.onload = async () => {
	if (version) {
		try {
			const response = await fetch(
				"https://registry.npmjs.org/cwrap-framework/latest",
			);
			if (response.ok) {
				const data = await response.json();
				version.textContent = `Version: ${data.version}`;
			} else {
				console.error("Failed to fetch version information");
			}
		} catch (error) {
			console.error("Error fetching version information:", error);
		}
	}
};

if (mobileNavButton) {
	mobileNavButton.onclick = () => {
		if (nav && documentation) {
			nav.style.opacity = nav.style.opacity === "1" ? "0" : "1";
			nav.style.userSelect = nav.style.userSelect === "auto" ? "none" : "auto";
			nav.style.pointerEvents =
				nav.style.pointerEvents === "auto" ? "none" : "auto";
			if (documentation.style.opacity === "0") {
				documentation.style.opacity = "1";
				setTimeout(() => {
					documentation.style.display = "flex";
				}, 100);
			} else {
				documentation.style.opacity = "0";
				setTimeout(() => {
					documentation.style.display = "none";
				}, 100);
			}
			documentation.style.userSelect =
				documentation.style.userSelect === "none" ? "auto" : "none";
			documentation.style.pointerEvents =
				documentation.style.pointerEvents === "none" ? "auto" : "none";

			document.body.style.overflowY =
				document.body.style.overflowY === "clip" ? "auto" : "clip";
		}
	};
}
