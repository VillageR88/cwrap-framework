const quoteID = document.getElementById("quoteID");
const quoteText = document.getElementById("quoteText");
const submitButton = document.getElementById("submitButton");
const localStorageId = "localStorageId";
const localStorageText = "localStorageText";
let quoteIDMemory;
let quoteTextMemory;
const quoteArray = [];
let runState = true;
quoteID.textContent =
	`ADVICE #${localStorage.getItem(localStorageId)}` || "ADVICE #117";
quoteText.textContent =
	localStorage.getItem(localStorageText) ||
	`“It is easy to sit up and take notice, what's difficult is getting up and taking action.”`;

async function getQuote() {
	if (!runState) return; // Prevents further calls if runState is false
	const response = await fetch("https://api.adviceslip.com/advice");
	const data = await response.json();
	if (data.slip.id !== quoteIDMemory) {
		quoteIDMemory = data.slip.id;
		quoteTextMemory = data.slip.advice;
		quoteArray.push({ quoteIDMemory, quoteTextMemory });
		console.log(quoteArray, quoteArray.length);
	}

	if (quoteArray.length < 5) {
		setTimeout(() => {}, 1000);
		getQuote();
	} else {
		runState = false; // Stop fetching once we have enough quotes
	}
}

getQuote();

function setQuote() {
	const quoteMemory = quoteArray.shift();
	if (quoteMemory) {
		quoteID.textContent = `ADVICE #${quoteMemory.quoteIDMemory}`;
		localStorage.setItem(localStorageId, quoteMemory.quoteIDMemory);
		quoteText.textContent = quoteMemory.quoteTextMemory;
		localStorage.setItem(localStorageText, quoteMemory.quoteTextMemory);
	}
	runState = true;
	getQuote();
}

submitButton.addEventListener("click", setQuote);
