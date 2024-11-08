/**
 * Adds production runtime CWrap scripts to the document.
 * @todo due to impact on production, this function implementation requires consideration like possibility of not adding the script in production or self removing the script after it has been used.
 */
export default function addRuntimeScripts() {
    const doc = global.id.doc;
	const mainScript = doc.createElement("script");
	mainScript.src = "scripts/cwrapFunctions.js";
	mainScript.type = "module";
	mainScript.customTag = "cwrapTempScript";
	doc.body.appendChild(mainScript);
}
