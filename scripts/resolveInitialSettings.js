export default async function resolveInitialSettings() {
	if (global.settings.empty === true) {
		try {
			const response = await fetch("/api/initial-settings");
			if (!response.ok) {
				global.id.settingsTreeFirstTime.style.display = "flex";
				throw new Error("Failed to fetch initial settings");
			}
			global.id.settingsTreeFirstTime.style.display = "none";
			const data = await response.json();
			global.settings = data;

			global.id.settingsTree.innerHTML = `<div id="settingsTreeSettings">
			<h3>Settings</h3>
			<pre>${JSON.stringify(global.settings, null, 2)}</pre>
			</div>`;
		} catch (error) {
			console.error("Error fetching initial settings:", error);
			throw new Error("Error fetching initial settings");
		}
	} else {
		global.settings.theme =
			global.id.themeSelect?.value || localStorage.getItem("theme") || "_dark";
		global.id.settingsTree.innerHTML = `<div id="settingsTreeSettings">
			<h3>Settings</h3>
			<pre>${JSON.stringify(global.settings, null, 2)}</pre>
			</div>`;
	}
}
