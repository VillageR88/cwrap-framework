export default function getHtmlAttributes() {
  const allHtmlAttributes = [
    "accept",
    "accept-charset",
    "action",
    "align",
    "alt",
    "aria-*",
    "async",
    "autocapitalize",
    "autofocus",
    "autoplay",
    "buffered",
    "border",
    "checked",
    "canplay",
    "canplaythrough",
    "charset",
    "class",
    "cite",
    "content",
    "contextmenu",
    "controls",
    "crossorigin",
    "data-*",
    "datetime",
    "defer",
    "decoding",
    "dir",
    "disabled",
    "download",
    "draggable",
    "enctype",
    "enterkeyhint",
    "error",
    "for",
    "form",
    "formaction",
    "formenctype",
    "formmethod",
    "formnovalidate",
    "formtarget",
    "headers",
    "height",
    "hidden",
    "id",
    "kind", // For `<track>`
    "href",
    "hreflang",
    "high",
    "ismap",
    "itemid",
    "itemprop",
    "itemref",
    "itemscope",
    "itemtype",
    "lang",
    "list",
    "loop",
    "loading",
    "low",
    "max",
    "maxlength",
    "min",
    "minlength",
    "multiple",
    "muted",
    "name",
    "novalidate",
    "nonce",
    "onabort",
    "onautocomplete",
    "onautocompleteerror",
    "onblur",
    "oncancel",
    "oncanplay",
    "oncanplaythrough",
    "onchange",
    "onclick",
    "onclose",
    "oncontextmenu",
    "oncuechange",
    "ondblclick",
    "ondrag",
    "ondragend",
    "ondragenter",
    "ondragleave",
    "ondragover",
    "ondragstart",
    "ondrop",
    "ondurationchange",
    "onemptied",
    "onended",
    "onerror",
    "onfocus",
    "oninput",
    "oninvalid",
    "onkeydown",
    "onkeypress",
    "onkeyup",
    "onload",
    "onloadeddata",
    "onloadedmetadata",
    "onloadstart",
    "onmousedown",
    "onmouseenter",
    "onmouseleave",
    "onmousemove",
    "onmouseout",
    "onmouseover",
    "onmouseup",
    "onpause",
    "onplay",
    "onplaying",
    "onprogress",
    "onratechange",
    "onreset",
    "onresize",
    "onscroll",
    "onseeked",
    "onseeking",
    "onselect",
    "onshow",
    "onstalled",
    "onsubmit",
    "onsuspend",
    "ontimeupdate",
    "ontoggle",
    "onvolumechange",
    "onwaiting",
    "onwheel",
    "optimum",
    "pattern",
    "placeholder",
    "ping",
    "playsinline",
    "poster",
    "preload",
    "referrerpolicy",
    "readonly", // Added
    "rel",
    "required",
    "role",
    "rowspan",
    "scope",
    "scoped",
    "selected",
    "slot",
    "sizes",
    "src",
    "srcset",
    "start",
    "step",
    "style",
    "tabindex",
    "target",
    "title",
    "translate",
    "type",
    "usemap",
    "value",
    "width",
    "accesskey",
    "autocomplete",
    "contenteditable",
    "contextmenu",
    "dir",
    "draggable",
    "enterkeyhint",
    "exportparts",
    "hidden",
    "id",
    "inputmode",
    "is",
    "itemid",
    "itemprop",
    "itemref",
    "itemscope",
    "itemtype",
    "lang",
    "nonce",
    "part",
    "role",
    "slot",
    "spellcheck",
    "style",
    "tabindex",
    "title",
    "translate",
    "download",
    "media",
    "scoped",
    "referrerpolicy",
    "rel",
    "target",
    "type",
  ].sort();

  return [...new Set(allHtmlAttributes)];
}
