/**
 * @typedef {import('./types.js').JsonObject} JsonObject
 * @typedef {import('./_globals.js')}
 */
/**
 *
 * @param {JsonObject} jsonObj
 */
export default function loadHead(jsonObj) {
    global.map.headMap.clear();
    if (jsonObj.head) {
        for (const [key, value] of Object.entries(jsonObj.head)) {
            global.map.headMap.set(key, value);
        }
    }
    onLoadPopulateHeadCreator();
}

export function onLoadPopulateHeadCreator() {
    const wizardHeadTitle = global.id.wizardHeadTitle;
    const wizardHeadMetaDescription = global.id.wizardHeadMetaDescription;
    const wizardHeadMetaKeywords = global.id.wizardHeadMetaKeywords;
    const wizardHeadLinksDiv = global.id.wizardHeadDiv; // Assuming this is the container for links
    const wizardHeadBase = global.id.wizardHeadBase; // Assuming this is the container for base

    const headMap = Object.fromEntries(global.map.headMap);
    const title = headMap.title;
    const meta = headMap.meta;
    const links = headMap.link;
    const base = meta.find((meta) => meta.name === "base")?.content;

    if (title) wizardHeadTitle.value = title;

    if (meta) {
        const metaDescription = meta.find(
            (meta) => meta.name === "description",
        )?.content;
        const metaKeywords = meta.find((meta) => meta.name === "keywords")?.content;

        if (metaDescription) wizardHeadMetaDescription.value = metaDescription;
        if (metaKeywords) wizardHeadMetaKeywords.value = metaKeywords;
    }

    if (base) {
        wizardHeadBase.value = base;
    }

    // Clear only the linkDiv elements within wizardHeadLinksDiv
    const linkDivs = wizardHeadLinksDiv.querySelectorAll(".linkDiv");
    for (const linkDiv of linkDivs) {
        linkDiv.remove();
    }

    if (links) {
        // Create a container div for all links
        let linksContainer = wizardHeadLinksDiv.querySelector(".linksContainer");
        if (!linksContainer) {
            linksContainer = document.createElement("div");
            linksContainer.classList.add("linksContainer");
            wizardHeadLinksDiv.appendChild(linksContainer);
        }
        linksContainer.innerHTML = "";

        links.forEach((link, index) => {
            // Create title h4 if it doesn't already exist
            let titleElement = linksContainer.querySelector("h4");
            if (!titleElement) {
                titleElement = document.createElement("h4");
                titleElement.textContent = "Links";
                linksContainer.appendChild(titleElement);
            }

            const linkDiv = document.createElement("div");
            linkDiv.classList.add("linkDiv");

            const relLabel = document.createElement("label");
            relLabel.textContent = "rel";
            const relInput = document.createElement("input");
            relInput.type = "text";
            relInput.value = link.rel ? link.rel : "";
            relInput.id = `link-${index}-rel`;
            relLabel.setAttribute("for", relInput.id);

            const hrefLabel = document.createElement("label");
            hrefLabel.textContent = "href";
            const hrefInput = document.createElement("input");
            hrefInput.type = "text";
            hrefInput.value = link.href ? link.href : "";
            hrefInput.id = `link-${index}-href`;
            hrefLabel.setAttribute("for", hrefInput.id);

            const typeLabel = document.createElement("label");
            typeLabel.textContent = "type";
            const typeInput = document.createElement("input");
            typeInput.type = "text";
            typeInput.value = link.type ? link.type : "";
            typeInput.id = `link-${index}-type`;
            typeLabel.setAttribute("for", typeInput.id);

            const removeSvg = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"> <path d="m376-300 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Zm-96 180q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Zm-400 0v520-520Z" /> </svg>`;
            const removeButton = document.createElement("button");
            removeButton.innerHTML = removeSvg;
            removeButton.classList.add(global.class.mediumButtons);
            removeButton.type = "button";
            removeButton.ariaLabel = "remove link";
            removeButton.dataset.title = "remove link";
            removeButton.addEventListener("click", () => {
                links.splice(index, 1); // Remove the link from the array
                onLoadPopulateHeadCreator(); // Re-render the links
            });

            const topDiv = document.createElement("div");
            topDiv.appendChild(relLabel);
            topDiv.appendChild(removeButton);

            linkDiv.appendChild(topDiv);
            linkDiv.appendChild(relInput);
            linkDiv.appendChild(hrefLabel);
            linkDiv.appendChild(hrefInput);
            linkDiv.appendChild(typeLabel);
            linkDiv.appendChild(typeInput);

            linksContainer.appendChild(linkDiv);
        });
    }

    const creatorHeadExtend = document.getElementById("creatorHeadExtend");
    creatorHeadExtend.innerHTML = "";
    // creatorHeadExtend.style.color = "transparent";
    const colorFill = document.documentElement.style.getPropertyValue(
        "--colorFill-regular",
    );
    const svgTemplate = ` <svg id="iconExtend" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill='${colorFill}'>
              <path
                d="M352-120H200q-33 0-56.5-23.5T120-200v-152q48 0 84-30.5t36-77.5q0-47-36-77.5T120-568v-152q0-33 23.5-56.5T200-800h160q0-42 29-71t71-29q42 0 71 29t29 71h160q33 0 56.5 23.5T800-720v160q42 0 71 29t29 71q0 42-29 71t-71 29v160q0 33-23.5 56.5T720-120H568q0-50-31.5-85T460-240q-45 0-76.5 35T352-120Zm-152-80h85q24-66 77-93t98-27q45 0 98 27t77 93h85v-240h80q8 0 14-6t6-14q0-8-6-14t-14-6h-80v-240H480v-80q0-8-6-14t-14-6q-8 0-14 6t-6 14v80H200v88q54 20 87 67t33 105q0 57-33 104t-87 68v88Zm260-260Z" />
            </svg>
    `;
    const svgDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svgTemplate)}`;
    creatorHeadExtend.style.backgroundImage = `url("${svgDataUrl}")`;
    creatorHeadExtend.style.backgroundRepeat = "no-repeat";
    creatorHeadExtend.style.backgroundPosition = "center";
    creatorHeadExtend.style.width = "24px";
    creatorHeadExtend.style.height = "24px";
    const creatorHeadExtendOptions = ["meta", "link", "script"];
    for (const option of creatorHeadExtendOptions) {
        const creatorHeadExtendOption = document.createElement("option");
        creatorHeadExtendOption.value = option;
        creatorHeadExtendOption.textContent = option;
        creatorHeadExtend.appendChild(creatorHeadExtendOption);
    }
}