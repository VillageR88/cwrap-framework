const global = {
	class: {
		labelDiv: "labelDiv",
		mediumButtons: "mediumButtons",
		remove: "remove",
		right: "right",
		shaded: "shaded",
		smallButtons: "smallButtons",
		smaller: "smaller",
	},
	id: {
		addAttribute: document.getElementById("addAttribute"),
		addElement: document.getElementById("addElement"),
		addProperty: document.getElementById("addProperty"),
		addStateProperty: document.getElementById("addStateProperty"),
		attributeInput: document.getElementById("attributeInput"),
		attributeSelect: document.getElementById("attributeSelect"),
		attributeSelectAll: document.getElementById("attributeSelectAll"),
		closeAddElement: document.getElementById("closeAddElement"),
		closeAddScreen: document.getElementById("closeAddScreen"),
		closeAddState: document.getElementById("closeAddState"),
		closeState: document.getElementById("closeState"),
		contextSelectAllDiv: document.getElementById("contextSelectAllDiv"),
		creatorSave: document.getElementById("creatorSave"),
		creatorExtend: document.getElementById("creatorExtend"),
		/** @type {Document} */
		doc:
			document.getElementById("preview").contentDocument ||
			document.getElementById("preview").contentWindow.document,
		editAttributes: document.getElementById("editAttributes"),
		editStateStyle: document.getElementById("editStateStyle"),
		editStyle: document.getElementById("editStyle"),
		editText: document.getElementById("editText"),
		elementHeaderDiv: document.getElementById("elementHeaderDiv"),
		elementSelect: document.getElementById("elementSelect"),
		elementSelectAll: document.getElementById("elementSelectAll"),
		elementStateDiv: document.getElementById("elementStateDiv"),
		elementStateSelect: document.getElementById("elementStateSelect"),
		handOnLogo: document.getElementById("handOnLogo"),
		headAttributeDiv: document.getElementById("headAttributeDiv"),
		headInput: document.getElementById("headInput"),
		headSelectAttribute: document.getElementById("headSelectAttribute"),
		headSelectOption: document.getElementById("headSelectOption"),
		leftSide: document.getElementById("leftSide"),
		leftSidebar: document.getElementById("leftSidebar"),
		leftSidebarAddition: document.getElementById("leftSidebarAddition"),
		leftSidebarCanvas: document.getElementById("leftSidebarCanvas"),
		leftSidebarSwitchSide: document.getElementById("leftSidebarSwitchSide"),
		mainAttributeAdd: document.getElementById("mainAttributeAdd"),
		mainAttributeAddBack: document.getElementById("mainAttributeAddBack"),
		mainAttributeSelector: document.getElementById("mainAttributeSelector"),
		mainAttributeSelector2: document.getElementById("mainAttributeSelector2"),
		mainAttributeSelectorBack: document.getElementById(
			"mainAttributeSelectorBack",
		),
		mainBody: document.getElementById("mainBody"),
		mainElementAdd: document.getElementById("mainElementAdd"),
		mainInitialSelector: document.getElementById("mainInitialSelector"),
		mainStateStyleAdd: document.getElementById("mainStateStyleAdd"),
		mainStateStyleSelector: document.getElementById("mainStateStyleSelector"),
		mainStateStyleSelector2: document.getElementById("mainStateStyleSelector2"),
		mainStateStyleSelectorBack: document.getElementById(
			"mainStateStyleSelectorBack",
		),
		mainStateStyleAddBack: document.getElementById("mainStateStyleAddBack"),
		mainStyleAdd: document.getElementById("mainStyleAdd"),
		mainStyleAddBack: document.getElementById("mainStyleAddBack"),
		mainStyleSelector: document.getElementById("mainStyleSelector"),
		mainStyleSelector2: document.getElementById("mainStyleSelector2"),
		mainStateSelector: document.getElementById("mainStateSelector"),
		mainStateAdd: document.getElementById("mainStateAdd"),
		mainStyleSelectorBack: document.getElementById("mainStyleSelectorBack"),
		mainStateStyleContextInfo: document.getElementById(
			"mainStateStyleContextInfo",
		),
		mainTextEditor: document.getElementById("mainTextEditor"),
		mainTextEditor2: document.getElementById("mainTextEditor2"),
		mainTextEditorBack: document.getElementById("mainTextEditorBack"),
		mask: document.getElementById("mask"),
		menuReload: document.getElementById("menuReload"),
		menuSave: document.getElementById("menuSave"),
		nameHelper: document.getElementById("nameHelper"),
		navAdditionalScreen: document.getElementById("navAdditionalScreen"),
		navBody: document.getElementById("navBody"),
		navBodyAdditional: document.getElementById("navBodyAdditional"),
		navDevice: document.getElementById("navDevice"),
		navFonts: document.getElementById("navFonts"),
		navHead: document.getElementById("navHead"),
		navLvlMenu: document.getElementById("navLvlMenu"),
		navLvlMenuTheme: document.getElementById("navLvlMenuTheme"),
		navLvlMenuSettings: document.getElementById("navLvlMenuSettings"),
		navLvlRoute: document.getElementById("navLvlRoute"),
		navLvlRouteBack: document.getElementById("navLvlRouteBack"),
		navPreview: document.getElementById("navPreview"),
		navPreviewNormal: document.getElementById("navPreviewNormal"),
		navPreviewStatic: document.getElementById("navPreviewStatic"),
		navPreviewTree: document.getElementById("navPreviewTree"),
		navRoot: document.getElementById("navRoot"),
		navSelection: document.getElementById("navSelection"),
		navSelectionBuild: document.getElementById("navSelectionBuild"),
		navSelectionBuildRoutes: document.getElementById("navSelectionBuildRoutes"),
		navSelectionStatic: document.getElementById("navSelectionStatic"),
		navSections: document.getElementById("navSections"),
		navScreenDesktop: document.getElementById("navScreenDesktop"),
		navScreenMobile: document.getElementById("navScreenMobile"),
		navScreenTablet: document.getElementById("navScreenTablet"),
		navSelectPreview: document.getElementById("navSelectPreview"),
		onlyLogo: document.getElementById("onlyLogo"),
		openAddAttribute: document.getElementById("openAddAttribute"),
		openAddElement: document.getElementById("openAddElement"),
		openAddProperty: document.getElementById("openAddProperty"),
		openAddScreen: document.getElementById("openAddScreen"),
		openAddState: document.getElementById("openAddState"),
		openAddStateProperty: document.getElementById("openAddStateProperty"),
		openState: document.getElementById("openState"),
		addState: document.getElementById("addState"),
		mainStateSelectorBack: document.getElementById("mainStateSelectorBack"),
		popupBackend: document.getElementById("popupBackend"),
		popupBackendConfirm: document.getElementById("popupBackendConfirm"),
		popupBackendReject: document.getElementById("popupBackendReject"),
		popupLink: document.getElementById("popupLink"),
		popupLinkConfirm: document.getElementById("popupLinkConfirm"),
		popupLinkReject: document.getElementById("popupLinkReject"),
		preview: document.getElementById("preview"),
		previewTree: document.getElementById("previewTree"),
		propertyInput: document.getElementById("propertyInput"),
		propertySelect: document.getElementById("propertySelect"),
		propertySelectAll: document.getElementById("propertySelectAll"),
		propertySelectAllDiv: document.getElementById("propertySelectAllDiv"),
		removeElement: document.getElementById("removeElement"),
		removeProperty: document.getElementById("removeProperty"),
		removeStateProperty: document.getElementById("removeStateProperty"),
		rootInput: document.getElementById("rootInput"),
		rootSelectVariable: document.getElementById("rootSelectVariable"),
		routesTree: document.getElementById("routesTree"),
		sectionsVariables: document.getElementById("sectionsVariables"),
		selectContext: document.getElementById("selectContext"),
		selectContextHighlight: document.getElementById("selectContextHighlight"),
		selectStateOfContext: document.getElementById("selectStateOfContext"),
		selectedElementHighlight: document.getElementById(
			"selectedElementHighlight",
		),
		selectedElementLabel: document.getElementById("selectedElementLabel"),
		selectedElementLabelContainer: document.getElementById(
			"selectedElementLabelContainer",
		),
		selectedElementLabelContainerSwitchSide: document.getElementById(
			"selectedElementLabelContainerSwitchSide",
		),
		settingsTree: document.getElementById("settingsTree"),
		settingsTreeFirstTime: document.getElementById("settingsTreeFirstTime"),
		settingsTreeFirstTimeCreateSettings: document.getElementById(
			"settingsTreeFirstTimeCreateSettings",
		),
		stateContextInfo: document.getElementById("stateContextInfo"),
		statePropertyInput: document.getElementById("statePropertyInput"),
		statePropertySelect: document.getElementById("statePropertySelect"),
		statePropertySelectAll: document.getElementById("statePropertySelectAll"),
		stateSelectAll: document.getElementById("stateSelectAll"),
		style: document.getElementById("style"),
		styleRow: document.getElementById("styleRow"),
		themesTree: document.getElementById("themesTree"),
		updateAttribute: document.getElementById("updateAttribute"),
		updateProperty: document.getElementById("updateProperty"),
		updateStateProperty: document.getElementById("updateStateProperty"),
		updateText: document.getElementById("updateText"),
		wizard: document.getElementById("wizard"),
		wizardDiv: document.getElementById("wizardDiv"),
		wizardFontsDiv: document.getElementById("wizardFontsDiv"),
		wizardHeadDiv: document.getElementById("wizardHeadDiv"),
		wizardHeadMetaDescription: document.getElementById(
			"wizardHeadMetaDescription",
		),
		wizardHeadMetaKeywords: document.getElementById("wizardHeadMetaKeywords"),
		wizardHeadTitle: document.getElementById("wizardHeadTitle"),
		wizardRootDiv: document.getElementById("wizardRootDiv"),
		wizardTitle: document.getElementById("wizardTitle"),
	},
	map: {
		cssMap: new Map(),
		extendMap: new Map(), //TODO: this map is probably not used
		fontMap: new Map(),
		headMap: new Map(),
		mediaQueriesMap: new Map(),
		rootMap: new Map(),
	},
	variable: {
		memoryElement: "",
		parent: "",
		style: "", //this is probably not used
	},
	themes: {
		_dark: {
			"--colorText-primary": "#fbfcfb",
			"--colorText-secondary": "#fbfcfb",
			"--colorFill-regular": "#e8eaed",
			"--colorText-placeholder": "#8b949e",
			"--colorBorder-darker": "#2e3339b3",
			"--colorBorder-lighter": "#3d444d",
			"--colorBackground-body": "#0d1117",
			"--colorBackground-darker": "#10151c",
			"--colorBackground-lighter": "#151b23",
			"--colorShadow-regular": "#0c0f13",
			"--colorBackground-textField": "#151e2a",
			"--colorButton-regular": "#151b23",
			"--colorButton-light": "#8b949e",
		},
		_light: {
			"--colorText-primary": "black",
			"--colorText-secondary": "black",
			"--colorFill-regular": "#404040",
			"--colorText-placeholder": "#6c757d",
			"--colorBorder-darker": "#f0f0ff",
			"--colorBorder-lighter": "white",
			"--colorBackground-body": "#fafafa",
			"--colorBackground-darker": "#f0f1f1",
			"--colorBackground-lighter": "#fbfbfb",
			"--colorShadow-regular": "#adb5bd",
			"--colorBackground-textField": "#ffffff",
			"--colorButton-regular": "#faffff",
			"--colorButton-light": "#e8eaed",
		},
		dunes: {
			"--colorText-primary": "#FFEE8c",
			"--colorText-secondary": "#e0c097",
			"--colorFill-regular": "#FFEE8c",
			"--colorText-placeholder": "#d2b48c",
			"--colorBorder-darker": "#a0622d",
			"--colorBorder-lighter": "#cd854f",
			"--colorBackground-body": "#3e2723",
			"--colorBackground-darker": "#4e342e",
			"--colorBackground-lighter": "#5d4037",
			"--colorShadow-regular": "#2e1c1b",
			"--colorBackground-textField": "#795548",
			"--colorButton-regular": "#6d4c41", //little bit lighter is
			"--colorButton-light": "#6d4c11",
		},
		forest: {
			"--colorText-primary": "#cfe8d1",
			"--colorText-secondary": "#a8d5ba",
			"--colorFill-regular": "#cfe8d1",
			"--colorText-placeholder": "#8fbf8f",
			"--colorBorder-darker": "#4a7c59",
			"--colorBorder-lighter": "#6fae75",
			"--colorBackground-body": "#2e3d2f",
			"--colorBackground-darker": "#3a4a3b",
			"--colorBackground-lighter": "#4b5a4c",
			"--colorShadow-regular": "#1e2a1f",
			"--colorBackground-textField": "#5a6b5c",
			"--colorButton-regular": "#4a5b4c",
			"--colorButton-light": "#6fae75",
		},
		"retro-wave": {
			"--colorText-primary": "#ff6ec7",
			"--colorText-secondary": "#b7a4e0",
			"--colorFill-regular": "#ffcff3",
			"--colorText-placeholder": "#ff9ff3",
			"--colorBorder-darker": "#b33771",
			"--colorBorder-lighter": "#ff6ec7",
			"--colorBackground-body": "#1b1b2f",
			"--colorBackground-darker": "#162447",
			"--colorBackground-lighter": "#1f4068",
			"--colorShadow-regular": "#53354a",
			"--colorBackground-textField": "#1b1b2f",
			"--colorButton-regular": "#b33771",
			"--colorButton-light": "#ff6ec7",
		},
		nautical: {
			"--colorText-primary": "yellow",
			"--colorText-secondary": "#ffcc00",
			"--colorFill-regular": "blue",
			"--colorText-placeholder": "rgb(255, 204, 0)",
			"--colorBorder-darker": "#ffb300",
			"--colorBorder-lighter": "#ffeb3b",
			"--colorBackground-body": "cornflowerblue",
			"--colorBackground-darker": "#0000cf",
			"--colorBackground-lighter": "blue",
			"--colorShadow-regular": "black",
			"--colorBackground-textField": "#003fff", //blue  hex is #0000ff
			"--colorButton-regular": "#f4cc55",
			"--colorButton-light": "#f4fc55",
		},
		vibe95: {
			"--colorText-primary": "#000000",
			"--colorText-secondary": "#fafafa",
			"--colorFill-regular": "black",
			"--colorText-placeholder": "#808080",
			"--colorBorder-darker": "darkgray",
			"--colorBorder-lighter": "lightgray",
			"--colorBackground-body": "#006060",
			"--colorBackground-darker": "#007070",
			"--colorBackground-lighter": "#008080 ",
			"--colorShadow-regular": "#000000",
			"--colorBackground-textField": "#ffffe0",
			"--colorButton-regular": "#c0c0c0",
			"--colorButton-light": "#fafafa",
		},
	},
	settings: { empty: true },
};

global.map.mediaQueriesMap.set("max-width: 640px", new Map());
global.map.mediaQueriesMap.set("max-width: 768px", new Map());
