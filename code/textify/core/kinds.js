export function kinds(tagName) {  

  // how: to handle "*" exceptions? (spec)
  // how: to handle "!" exceptions? (mine)
  // how: more optimal search 
  
  let tags = {
    phrasing: ["a*", "abbr", "area*", "audio", "b", "bdi", "bdo", "br", "button", "canvas", "cite", "code", "data", "date", "datalist", "del*", "dfn", "em", "embed", "i", "iframe", "img", "input", "ins*", "kbd", "keygen", "label", "link*", "map*", "mark", "math", "meta*", "meter", "noscript", "object", "output", "picture", "progress", "q", "ruby", "s", "samp", "script", "select", "slot", "small", "span", "strong", "sub", "sup", "svg", "template", "textarea", "time", "u", "var", "video", "wbr", "Text*"],
    embedded: ["audio", "canvas", "embed", "iframe", "img", "math", "object", "picture", "svg", "video"],
    heading: ["h1", "h2", "h3", "h4", "h5", "h6", "hgroup"],
    sectioning: ["article", "aside", "nav", "section"],
    metadata: ["base", "link", "meta", "noscript", "script", "style", "template", "title"],
    navigation: ["menu","nav","search"], // custom field;
    interactive: ["a*", "audio*", "button", "details", "embed", "iframe", "img*", "input*", "keygen", "label", "object*", "select", "textarea", "video*"],
    flow: ["a", "abbr", "address", "area*", "article", "aside", "audio", "b", "bdi", "bdo", "blockquote", "br", "button", "canvas", "cite", "code", "data", "date", "datalist", "del", "details", "dfn", "dialog", "div", "dl", "em", "embed", "fieldset", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "hr", "i", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "li*!", "link*", "main*", "map", "mark", "math", "menu", "meta*", "meter", "nav", "noscript", "object", "ol", "output", "p", "picture", "pre", "progress", "q", "ruby", "s", "samp", "script", "search", "section", "select", "slot", "small", "span", "strong", "sub", "sup", "svg", "table", "template", "textarea", "time", "u", "ul", "var", "video", "wbr", "Text*"],
  };

  let kind = Object.entries(tags)
      .filter(([type, tags]) => tags.some((tag) => tag.split('*')[0] == (tagName ?? "").toLowerCase()))
      .map((d) => d[0])
  
  return kind
}