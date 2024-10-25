export function index(recs) {

  let perf = performance.now();

  let base = this.base ?? new Map();
      base.clear();
      
  let data = recs ?? Object.entries({
    phrasing: ["a*", "span", "img", "br", "script", "meta*", "link*", "i", "input", "strong", "b", "label", "button", "svg", "em", "noscript", "time", "iframe", "small", "select", "abbr", "sup", "ins*", "u", "picture", "area*", "code", "textarea", "video", "cite", "dfn", "del*", "date", "keygen", "Text*", "s", "wbr", "sub", "kbd", "object", "map*", "var", "embed", "canvas", "template", "bdi", "q", "audio", "mark", "samp", "ruby", "bdo", "data", "meter", "output", "slot", "progress", "math", "datalist"],
    embedded: ["audio", "canvas", "embed", "iframe", "img", "math", "object", "picture", "svg", "video"],
    heading: ["h1", "h2", "h3", "h4", "h5", "h6", "hgroup"],
    sectioning: ["section", "article", "nav", "aside"],
    metadata: ["base", "link", "meta", "noscript", "script", "style", "template", "title"],
    navigation: ["nav", "menu", "nav"], // custom field;
    interactive: ["a*", "img*", "input*", "label", "button", "iframe", "select", "textarea", "video*", "keygen", "object*", "embed", "audio*", "details"],
    flow: ["div", "a", "span", "li*!", "img", "br", "p", "script", "ul", "meta*", "link*", "i", "input", "strong", "h2", "h3", "b", "h4", "label", "table", "button", "svg", "section", "article", "em", "form", "h1", "noscript", "header", "time", "figure", "dl", "h5", "iframe", "hr", "footer", "nav", "small", "aside", "select", "h6", "abbr", "sup", "ins", "u", "ol", "blockquote", "picture", "fieldset", "area*", "code", "textarea", "video", "cite", "dfn", "main*", "pre", "del", "address", "date", "keygen", "search", "Text*", "s", "wbr", "sub", "kbd", "object", "map", "hgroup", "var", "embed", "menu", "canvas", "template", "bdi", "q", "audio", "mark", "details", "samp", "ruby", "bdo", "data", "meter", "output", "slot", "progress", "dialog", "math", "datalist"],
  });

  let span = data.length;
  for (let col = 0; col < span; col++) {
    let [kind, list] = data[col];
    let size = list.length;

    for (let row = 0; row < size; row++) {
      let type = list[row].split(/(\*)/);
      let edge = type[1] ?? [];
      type = type[0];
      base.set(type, (base.get(type) || [...edge]).concat(kind))
      //dict.set(type, (dict.get(type) ?? new Set().add(edge).add(kind)).add(kind));
    }
  }

  return { 
    time: performance.now() - perf,
    dict: this.base = base
  }

}