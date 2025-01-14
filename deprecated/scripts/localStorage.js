// Set an event listener for when the window loads
window.onload = () => {
	// Get the flex direction state from localStorage
	const flexDirection = localStorage.getItem("flexDirection");
	// If the state is "horizontal", add the "horizontal" class to the body element
	if (flexDirection === "horizontal") {
		document.body.classList.add("horizontal");
	}
};
