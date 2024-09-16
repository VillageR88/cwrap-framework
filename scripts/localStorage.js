// Set an event listener for when the window loads
window.onload = () => {
	// Get the flex direction state from localStorage
	const flexDirection = localStorage.getItem("flexDirection");
	const hideArrow = localStorage.getItem("hideArrow");
	// If the state is "horizontal", add the "horizontal" class to the body element
	if (flexDirection === "horizontal") {
		document.body.classList.add("horizontal");
	}
	if (hideArrow === "true") {
		document.getElementById("handOnLogo").style.display = "none";
	}
};
