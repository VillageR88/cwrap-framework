const { strings1 } = require("./_const");

const regex1 = /(?!>)\S\s(\S+)$/;
const regex2 = /(?!:nth-of-type\(\d+\))([:.#]\S+)/;
const regex3 = /(?!>)\S\s(\S+)$|(?!:nth-of-type\(\d+\))([:.#]\S+)/;
const regexArray = [regex1, regex2, regex3];
for (const regexItem of regexArray) {
	console.log("Regex:", regexItem);
	for (const str of strings1) {
		const match = str.match(regexItem);
		console.log(`String: "${str}"`);
		console.log(`Match: ${match?.[1] ?? match?.[2] ?? "No match"}`);
		console.log("---");
	}
}
