export default function addLinks(head, jsonSrc) {
  const doc = global.id.doc;
  if (jsonSrc?.head?.link) {
    for (let i = 0; i < jsonSrc.head.link.length; i++) {
      const linkObj = jsonSrc.head.link[i];
      const link = doc.createElement("link");
      for (const [key, value] of Object.entries(linkObj)) {
        link.setAttribute(key, value);
      }
      head.appendChild(link);
    }
  }
}
