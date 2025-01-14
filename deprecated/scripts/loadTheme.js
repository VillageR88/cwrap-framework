export default function loadTheme(option) {
	const theme = global.themes[option] || global.themes._dark;
	applyTheme(theme);
}

function applyTheme(theme) {
	const root = document.documentElement;
	for (const [property, value] of Object.entries(theme)) {
		root.style.setProperty(property, value);
	}
}
