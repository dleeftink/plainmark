export default class Textifier {
  constructor({
    drop = ["embedded", "metadata", "interactive", "sectioning"],

    keep = ["A", "ARTICLE", "SECTION"],
    skip = ["SUP"],

    pick = ["href"],
  } = {}) {
    this.opts = { pick, skip, keep, drop };

  }

  textify(fragment) {

    fragment = this.recheck(fragment);

    let dict = this.restore(fragment);
    let fuse = this.regroup(dict.flat);

    return {
      dict,
      fuse,
    };

  }

  recheck(fragment) {

    return fragment instanceof DocumentFragment
      ? fragment
      : document.getSelection().rangeCount
        ? document
            .getSelection()
            .getRangeAt(0)
            .cloneContents()
        : document.createDocumentFragment();

  }

  restore(fragment) {

    let kind = this.kindsof;
    let code = this.recoder;

    let root = document.body;
    let main = document.createElement("main");
    let host = main.attachShadow({ mode: "open" });

    let frag =
      fragment ??
      getSelection().getRangeAt(0).cloneContents();
    let body = document.createElement("body");
    body.appendChild(frag);

    host.appendChild(body);
    root.appendChild(main);

    let flat = new Array();
    let pick = this.opts.pick ?? ["href"];

    let keep = this.opts.keep ?? ["A", "ARTICLE", "SECTION"];
    let skip = this.opts.skip ?? ["SUP"];
    let drop = this.opts.drop ?? ["embedded", "metadata", "interactive", "sectioning"];

    let prev, text, last;
    let walk = document.createTreeWalker(
      host,
      NodeFilter.SHOW_TEXT,
    );

    let perfA = performance.now();
    while ((text = walk.nextNode())) {
      let stem = text.parentNode;

      if (
        /^\n+$/.test(text.textContent.replaceAll(" ", ""))
      )
        text = document.createElement("br");
      if (text.tagName === "BR" && last?.tagName === "BR")
        continue;
      let atts = [...(stem?.attributes || [])];

      let node = stem;
      let path = [];
      let safe = 0;
      let attr;

      let tag = stem.tagName;
      let its = node.kind;
      let hop = node.skip;

      if (its == undefined) {
        its = node.kind = kind(tag);
      }

      if (hop == undefined) {
        hop = node.skip =
          its.some((kind) => drop.includes(kind)) ||
          skip.includes(node.tagName);
      }

      while (
        (attr = atts.pop()) !== undefined &&
        safe < 32
      ) {
        if (pick.includes(attr.name)) continue;
        stem.removeAttribute(attr.name);
        safe++;
      }

      if (hop && !keep.includes(node.tagName)) {
        continue;
      } else {
        delete node.skip;
      }

      safe = 0;

      while (node.parentNode && safe < 8) {
        safe++;

        if (node.skip) {
          node = node?.parentNode;
          continue;
        } else {
          node.kind = kind(node.tagName);
          node.skip =
            node.kind.some((kind) => drop.includes(kind)) ||
            skip.includes(node.tagName);
          if (node.skip && !keep.includes(node.tagName)) {
            continue;
          } else {
            delete node.skip;
          }
        }

        if (node.parentNode.path) {
          path = path.concat(node.parentNode.path);
          continue;
        }
        path.push(node);
        node = node.parentNode;
      }

      text.path = path;
      flat.push({ text, path });

      let a = 0,
        anode,
        bnode,
        b = 0;
      if (
        (anode = path.find(
          (d, i) => ((a = i), d.tagName == "A"),
        )) ==
        (bnode = prev?.find(
          (d, j) => ((b = j), d.tagName == "A"),
        ))
      ) {
        if (bnode !== undefined && Math.abs(a - b) < 2) {
          if (b > a) {
            flat.pop();
            flat.pop();
            flat.push({ text, path });
            text.textContent = stem.textContent;
          } else if (a > b) {
            flat.pop();
          }
        }
      }

      prev = path;
      last = text;
    }

    let perfB = performance.now();
    host.innerHTML = "";
    main.parentNode.removeChild(main);

    return {
      time: perfB - perfA,
      flat,
    };

  }

  regroup(flat) {

    let fuse = new Map();
    let last;

    let text, path, data;
    const size = flat.length;
    for (var i = 0; i < size; i++) {
      [text, path] = Object.values(flat[i]);

      if (!text.parentElement) {
        if (
          !(
            text.tagName == "BR" &&
            text.textContent.trim() == 0
          )
        )
          continue;
      }

      if (path[0].kind[0] == "phrasing") {
        data = [...(fuse.get(path[1]) ?? [])].concat(text);
        fuse.set(path[1], data);
        last = path[1];
      } else if (text.tagName == "BR") {
        data = [...(fuse.get(last) ?? [])].concat(text);
        fuse.set(last, data);
      } else {
        data = [...(fuse.get(path[0]) ?? [])].concat(text);
        fuse.set(path[0], data);
        last = path[0];
      }
    }
    return fuse;

  }

  recoder(string) {

    let hash = 0;
    for (let i = 0; i < string.length; i++) {
      const char = string.charCodeAt(i);
      hash = (hash << 5) - hash + char;
    }
    return hash >>> 0;

  }

  kindsof(tagName) {

    let tags = {
      phrasing: ["a*", "abbr", "area*", "audio", "b", "bdi", "bdo", "br", "button", "canvas", "cite", "code", "data", "date", "datalist", "del*", "dfn", "em", "embed", "i", "iframe", "img", "input", "ins*", "kbd", "keygen", "label", "link*", "map*", "mark", "math", "meta*", "meter", "noscript", "object", "output", "picture", "progress", "q", "ruby", "s", "samp", "script", "select", "slot", "small", "span", "strong", "sub", "sup", "svg", "template", "textarea", "time", "u", "var", "video", "wbr", "Text*"],
      embedded: ["audio", "canvas", "embed", "iframe", "img", "math", "object", "picture", "svg", "video"],
      heading: ["h1", "h2", "h3", "h4", "h5", "h6", "hgroup"],
      sectioning: ["article", "aside", "nav", "section"],
      metadata: ["base", "link", "meta", "noscript", "script", "style", "template", "title"],
      navigation: ["menu", "nav", "search"],
      interactive: ["a*", "audio*", "button", "details", "embed", "iframe", "img*", "input*", "keygen", "label", "object*", "select", "textarea", "video*"],
      flow: ["a", "abbr", "address", "area*", "article", "aside", "audio", "b", "bdi", "bdo", "blockquote", "br", "button", "canvas", "cite", "code", "data", "date", "datalist", "del", "details", "dfn", "dialog", "div", "dl", "em", "embed", "fieldset", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "hr", "i", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "li*!", "link*", "main*", "map", "mark", "math", "menu", "meta*", "meter", "nav", "noscript", "object", "ol", "output", "p", "picture", "pre", "progress", "q", "ruby", "s", "samp", "script", "search", "section", "select", "slot", "small", "span", "strong", "sub", "sup", "svg", "table", "template", "textarea", "time", "u", "ul", "var", "video", "wbr", "Text*"],
    };

    let kind = Object.entries(tags)
      .filter(([type, tags]) =>
        tags.some(
          (tag) =>
            tag.split("*")[0] ==
            (tagName ?? "").toLowerCase(),
        ),
      )
      .map((d) => d[0]);

    return kind;

  }
}
