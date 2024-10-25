export default class Textifier {
  constructor({
    drop = ["embedded", "metadata", "interactive", "sectioning"],
    keep = ["A", "ARTICLE", "SECTION"],
    skip = ["SUP"],
    pick = ["href"],
  } = {}) {
    
    this.cache = this.reindex();
    const opts = arguments[0];
    this.opts = { ...opts };
    this.base = new Object();
    this.flat = new Array();
    this.fuse = new Map();

  }

  textify(fragment) {

    let frag = (fragment = this.recheck(fragment));

    let { dict: base, time: A } = this.cache;
    let { list: flat, time: B } = this.restore(frag);
    let { dict: fuse, time: C } = this.regroup(flat);

    return {
      base,
      flat,
      fuse,
      time: {
        base: A,
        flat: B,
        fuse: C,
      },
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

  reindex(recs) {

    let perf = performance.now();

    let base = this?.cache?.dict ?? new Object();

    let data =
      recs ??
      Object.entries({
        phrasing: ["a*", "span", "img", "br", "script", "meta*", "link*", "i", "input", "strong", "b", "label", "button", "svg", "em", "noscript", "time", "iframe", "small", "select", "abbr", "sup", "ins*", "u", "picture", "area*", "code", "textarea", "video", "cite", "dfn", "del*", "date", "keygen", "Text*", "s", "wbr", "sub", "kbd", "object", "map*", "var", "embed", "canvas", "template", "bdi", "q", "audio", "mark", "samp", "ruby", "bdo", "data", "meter", "output", "slot", "progress", "math", "datalist"],
        embedded: ["audio", "canvas", "embed", "iframe", "img", "math", "object", "picture", "svg", "video"],
        heading: ["h1", "h2", "h3", "h4", "h5", "h6", "hgroup"],
        sectioning: ["section", "article", "nav", "aside"],
        metadata: ["base", "link", "meta", "noscript", "script", "style", "template", "title"],
        navigation: ["nav", "menu", "nav"],
        interactive: ["a*", "img*", "input*", "label", "button", "iframe", "select", "textarea", "video*", "keygen", "object*", "embed", "audio*", "details"],
        flow: ["div", "a", "span", "li*!", "img", "br", "p", "script", "ul", "meta*", "link*", "i", "input", "strong", "h2", "h3", "b", "h4", "label", "table", "button", "svg", "section", "article", "em", "form", "h1", "noscript", "header", "time", "figure", "dl", "h5", "iframe", "hr", "footer", "nav", "small", "aside", "select", "h6", "abbr", "sup", "ins", "u", "ol", "blockquote", "picture", "fieldset", "area*", "code", "textarea", "video", "cite", "dfn", "main*", "pre", "del", "address", "date", "keygen", "search", "Text*", "s", "wbr", "sub", "kbd", "object", "map", "hgroup", "var", "embed", "menu", "canvas", "template", "bdi", "q", "audio", "mark", "details", "samp", "ruby", "bdo", "data", "meter", "output", "slot", "progress", "dialog", "math", "datalist"],
      });

    let span = data.length;
    for (let col = 0; col < span; col++) {
      let [kind, list] = data[col];
      let size = list.length;

      for (let row = 0; row < size; row++) {
        let type = list[row].toUpperCase().split(/(\*)/);
        let edge = type[1] ?? [];
        type = type[0];
        let sets = base[type];

        if (sets) {
          sets.add(kind);
          if (edge.length) sets.add(edge);
        } else {
          base[type] = new Set([...edge]).add(kind);
        }
      }
    }

    return {
      time: performance.now() - perf,
      dict: base,
    };

  }

  restore(fragment) {

    let perf = performance.now();
    let kind = (tag) => this.base[tag] ?? new Set("");

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

    let list = this.flat ?? new Array();
    list.length = 0;
    let pick = this.opts.pick ?? ["href"];

    let keep = this.opts.keep ?? ["A", "ARTICLE", "SECTION"];
    let skip = this.opts.skip ?? ["SUP"];
    let drop = this.opts.drop ?? ["embedded", "metadata", "interactive", "sectioning"];

    let prev, text, last;
    let walk = document.createTreeWalker(
      host,
      NodeFilter.SHOW_TEXT,
    );

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
        its = node.kind = kind(tag ?? "Text");
      }

      if (hop == undefined) {
        hop = node.skip =
          drop.some((kind) => its.has(kind)) ||
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
            drop.some((kind) => node.kind.has(kind)) ||
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
      list.push({ text, path });

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
            list.length -= 2;
            list.push({ text, path });
            text.textContent = stem.textContent;
          } else if (a > b) {
            list.length -= 1;
          }
        }
      }

      prev = path;
      last = text;
    }

    host.innerHTML = "";
    main.parentNode.removeChild(main);

    return {
      time: performance.now() - perf,
      list: (this.flat = list),
    };

  }

  regroup(flat) {

    let perf = performance.now();
    let fuse = this.fuse ?? new Map();
    let last;
    fuse.clear();

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
    return {
      time: performance.now() - perf,
      dict: (this.fuse = fuse),
    };

  }
}
