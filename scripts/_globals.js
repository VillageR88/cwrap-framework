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
		navLvlRoute: document.getElementById("navLvlRoute"),
		navLvlRouteBack: document.getElementById("navLvlRouteBack"),
		navPreview: document.getElementById("navPreview"),
		navPreviewNormal: document.getElementById("navPreviewNormal"),
		navPreviewStatic: document.getElementById("navPreviewStatic"),
		navPreviewTree: document.getElementById("navPreviewTree"),
		navRoot: document.getElementById("navRoot"),
		navSelection: document.getElementById("navSelection"),
		navSelectionBuild: document.getElementById("navSelectionBuild"),
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
		stateContextInfo: document.getElementById("stateContextInfo"),
		statePropertyInput: document.getElementById("statePropertyInput"),
		statePropertySelect: document.getElementById("statePropertySelect"),
		statePropertySelectAll: document.getElementById("statePropertySelectAll"),
		stateSelectAll: document.getElementById("stateSelectAll"),
		style: document.getElementById("style"),
		styleRow: document.getElementById("styleRow"),
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
		extendMap: new Map(),
		fontMap: new Map(),
		headMap: new Map(),
		mediaQueriesMap: new Map(),
		rootMap: new Map(),
	},
	variable: {
		memoryElement: "",
		parent: "",
		style: "",
	},
};
