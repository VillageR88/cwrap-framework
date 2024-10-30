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
		addClassroomProperty: document.getElementById("addClassroomProperty"),
		addElement: document.getElementById("addElement"),
		addProperty: document.getElementById("addProperty"),
		addBlueprintProperty: document.getElementById("addBlueprintProperty"),
		addStateProperty: document.getElementById("addStateProperty"),
		attributeInput: document.getElementById("attributeInput"),
		attributeSelect: document.getElementById("attributeSelect"),
		attributeSelectAll: document.getElementById("attributeSelectAll"),
		blueprintAddAttribute: document.getElementById("blueprintAddAttribute"),
		blueprintAttributeInput: document.getElementById("blueprintAttributeInput"),
		blueprintAttributeSelect: document.getElementById(
			"blueprintAttributeSelect",
		),
		blueprintRemoveAttribute: document.getElementById(
			"blueprintRemoveAttribute",
		),
		blueprintAttributeSelectAll: document.getElementById(
			"blueprintAttributeSelectAll",
		),
		blueprintPropertySelect: document.getElementById("blueprintPropertySelect"),
		blueprintSelect: document.getElementById("blueprintSelect"),
		classroomPropertySelect: document.getElementById("classroomPropertySelect"),
		classroomPropertyInput: document.getElementById("classroomPropertyInput"),
		mainClassroomSelectorDelete: document.getElementById("mainClassroomSelectorDelete"),
		mainClassroomSelectorAdd: document.getElementById("mainClassroomSelectorAdd"),
		mainAddClassroomSelector: document.getElementById("mainAddClassroomSelector"),
		mainAddClassroomSelectorBack: document.getElementById("mainAddClassroomSelectorBack"),
		mainAddClassroomSelectorInputName: document.getElementById("mainAddClassroomSelectorInputName"),
		mainAddClassroomSelectorAdd: document.getElementById("mainAddClassroomSelectorAdd"),
		mainAddClassroomSelectorSelectType: document.getElementById("mainAddClassroomSelectorSelectType"),
		closeAddElement: document.getElementById("closeAddElement"),
		closeAddScreen: document.getElementById("closeAddScreen"),
		closeAddState: document.getElementById("closeAddState"),
		closeState: document.getElementById("closeState"),
		contextSelectAllDiv: document.getElementById("contextSelectAllDiv"),
		creatorSave: document.getElementById("creatorSave"),
		creatorExtend: document.getElementById("creatorExtend"),
		creatorHeadExtend: document.getElementById("creatorHeadExtend"),
		/** @type {Document} */
		doc:
			document.getElementById("preview").contentDocument ||
			document.getElementById("preview").contentWindow.document,
		editAttributes: document.getElementById("editAttributes"),
		editBlueprint: document.getElementById("editBlueprint"),
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
		mainBlueprintAttributeAdd: document.getElementById(
			"mainBlueprintAttributeAdd",
		),
		mainBlueprintAttributeAddBack: document.getElementById("mainBlueprintAttributeAddBack"),
		mainBlueprintAttributeSelector: document.getElementById(
			"mainBlueprintAttributeSelector",
		),
		mainBlueprintAttributeSelector2: document.getElementById(
			"mainBlueprintAttributeSelector2",
		),
		mainBlueprintAttributeSelectorBack: document.getElementById(
			"mainBlueprintAttributeSelectorBack",
		),
		mainBlueprintCounter: document.getElementById("mainBlueprintCounter"),
		mainBlueprintCounterBack: document.getElementById(
			"mainBlueprintCounterBack",
		),
		mainBlueprintCounterInput: document.getElementById(
			"mainBlueprintCounterInput",
		),
		mainBlueprintCounterUpdate: document.getElementById(
			"mainBlueprintCounterUpdate",
		),
		mainBlueprintSelector: document.getElementById("mainBlueprintSelector"),
		mainBlueprintSelectorAdd: document.getElementById(
			"mainBlueprintSelectorAdd",
		),
		mainBlueprintSelectorAttributes: document.getElementById(
			"mainBlueprintSelectorAttributes",
		),
		mainBlueprintSelectorBack: document.getElementById(
			"mainBlueprintSelectorBack",
		),
		mainBlueprintSelectorCounter: document.getElementById(
			"mainBlueprintSelectorCounter",
		),
		mainBlueprintSelectorDelete: document.getElementById(
			"mainBlueprintSelectorDelete",
		),
		mainBlueprintSelectorEditStyle: document.getElementById("mainBlueprintSelectorEditStyle"),
		mainBlueprintSelectorEditText: document.getElementById(
			"mainBlueprintSelectorEditText",
		),
		mainBlueprintStyleAdd: document.getElementById("mainBlueprintStyleAdd"),
		mainBlueprintStyleAddBack: document.getElementById("mainBlueprintStyleAddBack"),
		mainBlueprintStyleSelector: document.getElementById("mainBlueprintStyleSelector"),
		mainBlueprintStyleSelectorBack: document.getElementById("mainBlueprintStyleSelectorBack"),
		mainBlueprintStyleSelector2: document.getElementById("mainBlueprintStyleSelector2"),
		mainBlueprintTextEditor: document.getElementById("mainBlueprintTextEditor"),
		mainBlueprintTextEditorBack: document.getElementById(
			"mainBlueprintTextEditorBack",
		),
		mainBlueprintTextEditorUpdateBlueprintText: document.getElementById(
			"mainBlueprintTextEditorUpdateBlueprintText",
		),
		mainBlueprintTextEditor2: document.getElementById(
			"mainBlueprintTextEditor2",
		),
		mainClassroomStyleSelectorBack: document.getElementById("mainClassroomStyleSelectorBack"),
		mainBody: document.getElementById("mainBody"),
		mainClassroomSelector: document.getElementById("mainClassroomSelector"),
		mainClassroomSelectorSelectName: document.getElementById(
			"mainClassroomSelectorSelectName",
		),
		mainClassroomSelectorSelectType: document.getElementById(
			"mainClassroomSelectorSelectType",
		),
		mainClassroomSelectorEditStyle: document.getElementById("mainClassroomSelectorEditStyle"),
		mainClassroomStyleSelector: document.getElementById("mainClassroomStyleSelector"),
		mainClassroomStyleAdd: document.getElementById("mainClassroomStyleAdd"),
		mainClassroomStyleAddBack: document.getElementById("mainClassroomStyleAddBack"),
		mainClassroomStyleSelector2: document.getElementById("mainClassroomStyleSelector2"),
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
		navBodyToolset: document.getElementById("navBodyToolset"),
		navClassroom: document.getElementById("navClassroom"),
		navDevice: document.getElementById("navDevice"),
		navFonts: document.getElementById("navFonts"),
		navHead: document.getElementById("navHead"),
		navJavascript: document.getElementById("navJavascript"),
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
		openBlueprintAddAttribute: document.getElementById(
			"openBlueprintAddAttribute",
		),
		openBlueprintAddProperty: document.getElementById("openBlueprintAddProperty"),
		openClassroomAddProperty: document.getElementById("openClassroomAddProperty"),
		openState: document.getElementById("openState"),
		addState: document.getElementById("addState"),
		mainStateSelectorBack: document.getElementById("mainStateSelectorBack"),
		popupBackend: document.getElementById("popupBackend"),
		popupBackendConfirm: document.getElementById("popupBackendConfirm"),
		popupBackendReject: document.getElementById("popupBackendReject"),
		popupLink: document.getElementById("popupLink"),
		popupLinkConfirm: document.getElementById("popupLinkConfirm"),
		popupLinkReject: document.getElementById("popupLinkReject"),
		popupSubmit: document.getElementById("popupSubmit"),
		popupSubmitConfirm: document.getElementById("popupSubmitConfirm"),
		popupSubmitReject: document.getElementById("popupSubmitReject"),
		preview: document.getElementById("preview"),
		previewTree: document.getElementById("previewTree"),
		propertyBlueprintInput: document.getElementById("propertyBlueprintInput"),
		propertyBlueprintSelectAll: document.getElementById("propertyBlueprintSelectAll"),
		propertyClassroomSelectAll: document.getElementById("propertyClassroomSelectAll"),
		propertyInput: document.getElementById("propertyInput"),
		propertySelect: document.getElementById("propertySelect"),
		propertySelectAll: document.getElementById("propertySelectAll"),
		propertySelectAllDiv: document.getElementById("propertySelectAllDiv"),
		removeAttribute: document.getElementById("removeAttribute"),
		removeClassroomProperty: document.getElementById("removeClassroomProperty"),
		removeElement: document.getElementById("removeElement"),
		removeProperty: document.getElementById("removeProperty"),
		removePropertyBlueprintSelectProperty: document.getElementById(
			"removePropertyBlueprintSelectProperty",
		),
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
		updateBlueprintAttribute: document.getElementById(
			"updateBlueprintAttribute",
		),
		updateBlueprintProperty: document.getElementById("updateBlueprintProperty"),
		updateClassroomProperty: document.getElementById("updateClassroomProperty"),
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
		blueprintMap: new Map(),
		classroomMap: new Map(),
		cssMap: new Map(),
		fontMap: new Map(),
		headMap: new Map(),
		mediaQueriesMap: new Map(),
		rootMap: new Map(),
		stageMap: new Map(),
	},
	variable: {
		memoryElement: "",
		parent: "",
		style: "", //this is probably not used
	},
	themes: {
		" dark": {
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
			"--colorButtonBorder-regular": "#3d444d",
			"--colorButton-light": "#8b949e",
		},
		" light": {
			"--colorText-primary": "black",
			"--colorText-secondary": "black",
			"--colorFill-regular": "#404040",
			"--colorText-placeholder": "#6c757d",
			"--colorBorder-darker": "#fbfbff",
			"--colorBorder-lighter": "white",
			"--colorBackground-body": "#fafafa",
			"--colorBackground-darker": "#f0f1f1",
			"--colorBackground-lighter": "#fbfbfb",
			"--colorShadow-regular": "#adb5bd",
			"--colorBackground-textField": "#ffffff",
			"--colorButton-regular": "#faffff",
			"--colorButtonBorder-regular": "#fdffff",
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
			"--colorButton-regular": "#6d4c41",
			"--colorButtonBorder-regular": "#cd854f",
			"--colorButton-light": "#6d4c11",
		},
		service: {
			"--colorText-primary": "white", // lighter is #e8f5e9 and more lighter is #f1f8e9
			"--colorText-secondary": "#9dde90", //  lighter is #cfe8d1 and more lighter is #9fce90 but more
			"--colorFill-regular": "#cfe8df", // and darker is #cfe8d1 and more darker is #cfe8d1 and even more darker is #cfe8d1
			"--colorText-placeholder": "#acacac", // bit lighter is  #9a9b9c and more lighter is #9a9b9c
			"--colorBorder-darker": "#4a7c59",
			"--colorBorder-lighter": "#6f8e75",
			"--colorBackground-body": "#6a7a6f", // this color bit greenier is #87ceeb and more greenier is #87ceeb
			"--colorBackground-darker": "#3a4a3b",
			"--colorBackground-lighter": "#4b5a4c",
			"--colorShadow-regular": "#1e2a1f",
			"--colorBackground-textField": "#5a6b5c",
			"--colorButton-regular": "#4a5b4c",
			"--colorButtonBorder-regular": "#6f8e75", // little lighter is #6fae75 and more lighter is #6fae75
			"--colorButton-light": "#6fae75",
		},
		reptile: {
			"--colorText-primary": "white",
			"--colorText-secondary": "#4cef50",
			"--colorFill-regular": "#f1f8e9",
			"--colorText-placeholder": "#81c784",
			"--colorBorder-darker": "#1a4a32", // bit darker is #2e7d32 and more darker is #2e7d32
			"--colorBorder-lighter": "#3c5d6f", //more white is #37595f and more more white is #37595f
			"--colorBackground-body": "#2c3e50",
			"--colorBackground-darker": "#1b2a30",
			"--colorBackground-lighter": "#34495e",
			"--colorShadow-regular": "#1c2833",
			"--colorBackground-textField": "#2e4053",
			"--colorButton-regular": "#388e3c",
			"--colorButtonBorder-regular": "#66bb6a",
			"--colorButton-light": "#66bb6a",
		},
		mnemonic: {
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
			"--colorButtonBorder-regular": "#ff6ec7",
			"--colorButton-light": "#ff6ec7",
		},
		nautical: {
			"--colorText-primary": "yellow", //honeysuckle is #ffcc00 and more yellow is #ffcc00
			"--colorText-secondary": "#ffee00",
			"--colorFill-regular": "#0000df", // bit darker is #0000ff and more darker is #0000ff
			"--colorText-placeholder": "rgb(255, 204, 0)",
			"--colorBorder-darker": "#4f7e6b",
			"--colorBorder-lighter": "#4f7e7b", // more blue is #8a7b7b and more more blue is #8a7b7b
			"--colorBackground-body": "#0000dd",
			"--colorBackground-darker": "#0000ee",
			"--colorBackground-lighter": "#1030ff",
			"--colorShadow-regular": "black",
			"--colorBackground-textField": "#003fff", //blue  hex is #0000ff
			"--colorButton-regular": "#f4cc55",
			"--colorButtonBorder-regular": "#ffeb3b",
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
			"--colorBackground-textField": "#ffffef",
			"--colorButton-regular": "#c0c0c0",
			"--colorButtonBorder-regular": "lightgray",
			"--colorButton-light": "#fafafa",
		},
		"miami night": {
			"--colorText-primary": "#f020cc",
			"--colorText-secondary": "#00ffff",
			"--colorFill-regular": "#9900cc", //i am looking for best contrast for 00cccc and i am so far close is aa00bf// darker is #660099 and little bit lighter is #9900cc
			"--colorText-placeholder": "#760066", //dark is #660066 and more dark is #660066
			"--colorBorder-darker": "#006666",
			"--colorBorder-lighter": "#009999",
			"--colorBackground-body": "#1a1a1a",
			"--colorBackground-darker": "#333333",
			"--colorBackground-lighter": "#444444",
			"--colorShadow-regular": "#000000",
			"--colorBackground-textField": "#0a0a0a",
			"--colorButton-regular": "#00cccc",
			"--colorButtonBorder-regular": "#00ffff",
			"--colorButton-light": "#00ffff",
		},
	},
	settings: { empty: true },
	localSettings: {
		selectionColor: localStorage.getItem("selectionColor") || "red",
	},
};

global.map.mediaQueriesMap.set("max-width: 640px", new Map());
global.map.mediaQueriesMap.set("max-width: 768px", new Map());
// global.map.classroomMap.set("cssMap", new Map());
// global.map.classroomMap.set("mediaQueriesMap", new Map());
// global.map.classroomMap
// 	.get("mediaQueriesMap")
// 	.set("max-width: 640px", new Map());
// global.map.classroomMap
// 	.get("mediaQueriesMap")
// 	.set("max-width: 768px", new Map());
