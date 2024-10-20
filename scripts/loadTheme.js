export default function loadTheme() {
	theme1();
}

function theme1() {
	const root = document.documentElement;
	root.style.setProperty("--colorText-primary", "#fbfcfb");
	root.style.setProperty("--colorFill-regular", "#e8eaed");
	root.style.setProperty("--colorText-placeholder", "#8b949e");
	root.style.setProperty("--colorBorder-darker", "#2e3339b3");
	root.style.setProperty("--colorBorder-lighter", "#3d444d");
	root.style.setProperty("--colorBackground-body", "#0d1117");
	root.style.setProperty("--colorBackground-darker", "#10151c");
	root.style.setProperty("--colorBackground-lighter", "#151b23");
	root.style.setProperty("--colorShadow-regular", "#0c0f13");
	root.style.setProperty("--colorBackground-textField", "#151e2a");
	root.style.setProperty("--colorButton-regular", "#151b23");
	root.style.setProperty("--colorButton-light", "#e8eaed");
}

function theme2() {
	const root = document.documentElement;
	root.style.setProperty("--colorText-primary", "black"); // Dark text for light background
	root.style.setProperty("--colorFill-regular", "black"); // Light fill color
	root.style.setProperty("--colorText-placeholder", "#6c757d"); // Lighter placeholder text
	root.style.setProperty("--colorBorder-darker", "#f0f0ff"); // Light border color
	root.style.setProperty("--colorBorder-lighter", "#f0f3ff"); // Lighter border color
	root.style.setProperty("--colorBackground-body", "white"); // Light body background
	root.style.setProperty("--colorBackground-darker", "#f0f1f1"); // Slightly darker background
	root.style.setProperty("--colorBackground-lighter", "#fbfbfb"); // Lightest background
	root.style.setProperty("--colorShadow-regular", "#adb5bd"); // Light shadow color
	root.style.setProperty("--colorBackground-textField", "#ffffff"); // Light text field background
	root.style.setProperty("--colorButton-regular", "#faffff");
	root.style.setProperty("--colorButton-light", "#e8eaed");
}
