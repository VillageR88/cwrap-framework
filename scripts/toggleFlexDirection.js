/**
 * Toggles the flex direction of the body element between horizontal and vertical.
 */
export default function toggleFlexDirection() {
  // Get the body element
  const bodyElement = document.body;
  // Toggle the "horizontal" class on the body element
  bodyElement.classList.toggle("horizontal");

  // If the body element has the "horizontal" class, save the state in localStorage
  if (bodyElement.classList.contains("horizontal")) {
    localStorage.setItem("flexDirection", "horizontal");
  } else {
    // Otherwise, remove the state from localStorage
    localStorage.removeItem("flexDirection");
  }
}
