export default class Textifier {
  constructor({
    drop = ["embedded", "metadata", "interactive", "sectioning"],
    keep = ["A", "ARTICLE", "SECTION"],
    skip = ["SUP"],
    pick = ["href"],
    step = 8,
    hops = 2,
    same = 2,
  } = {}) {
    const opts = arguments[0];
    this.opts = { ...opts };
    this.base = new Object();
    this.flat = new Array();
    this.fuse = new Map();

    this.reindex();

  }

  textify(fragment) {

    let frag = (fragment = this.recheck(fragment));

    let { dict: base, time: A } = this.reindex(null);
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
    let base = this.base ?? new Object();

    if (Object.keys(base).length == 0 || recs?.length > 0) {
      let data =
        recs ??
        Object.entries({
          phrasing: ["a*", "span", "img", "br", "script", "meta*", "link*", "i", "input", "strong", "b", "label", "button", "svg", "em", "noscript", "time", "iframe", "small", "select", "abbr", "sup", "ins*", "u", "picture", "area*", "code", "textarea", "video", "cite", "dfn", "del*", "date", "keygen", "Text*", "s", "wbr", "sub", "kbd", "object", "map*", "var", "embed", "canvas", "template", "bdi", "q", "audio", "mark", "samp", "ruby", "bdo", "data", "meter", "output", "slot", "progress", "math", "datalist"],
          embedded: ["audio", "canvas", "embed", "iframe", "img", "math", "object", "picture", "svg", "video"],
          heading: ["h1", "h2", "h3", "h4", "h5", "h6", "hgroup"],
          sectioning: ["section", "article", "nav", "aside"],
          metadata: ["base", "link", "meta", "noscript", "script", "style", "template", "title"],
          navigation: ["nav", "menu", "search", "dialog"],
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
    }

    return {
      time: performance.now() - perf,
      dict: (this.base = base),
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
    body.appendChild(frag.cloneNode(true));

    host.appendChild(body);
    root.appendChild(main);

    let list = this.flat ?? new Array();
    list.length = 0;
    let pick = this.opts.pick ?? ["href"];

    let keep = this.opts.keep ?? ["A", "ARTICLE", "SECTION"];
    let skip = this.opts.skip ?? ["SUP"];
    let drop = this.opts.drop ?? ["embedded", "metadata", "interactive", "sectioning"];

    let dist = this.opts.hops ?? 2;
    let same = this.opts.same ?? 2;

    let prev, text, past;
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
      if (text.tagName === "BR" && past?.tagName === "BR")
        continue;
      let atts = [...(stem?.attributes || [])];

      let node = stem;
      let path = [];
      let safe = 0;
      let hops = 0;
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

      let step = Math.max(0, this.opts.step ?? 8);
      let last = node;
      safe = 0;

      while (node.parentNode && safe < step) {
        safe++;

        if (node.skip) {
          node = node?.parentNode;
          hops++;
          continue;
        } else {
          node.kind = kind(node.tagName);
          node.skip =
            drop.some((kind) => node.kind.has(kind)) ||
            skip.includes(node.tagName);
          if (node.skip && !keep.includes(node.tagName)) {
            hops++;
            continue;
          } else {
            delete node.skip;
          }
        }

        if (node.parentNode.path) {
          path = path.concat(node.parentNode.path);
          continue;
        }

        if (!text.wrap) {
          if (
            last &&
            last.kind.has("phrasing") &&
            !node.kind.has("phrasing")
          ) {
            text.wrap = node;
          } else if (past && text.tagName == "BR") {
            text.wrap = past.wrap;
          } else if (
            path.length <= 1 &&
            !node.kind.has("phrasing")
          ) {
            text.wrap = last;
          }
          last = node;
        }

        if (node.kind.has("phrasing")) {
          text.form = node;
        } else if (path.length == 0) {
          text.form = null;
        }

        path.push(node);
        node = node.parentNode;
      }

      if (hops < dist) {
        let dupl = new Set().add(text.textContent);
        let span = path.length;

        for (let n = 0; n < span; n++) {
          let node = path[n];
          if (node.kind.has("phrasing"))
            dupl.add(node.textContent);
          if (dupl.size > same) break;
        }

        if (dupl.size <= same) {
          text.path = path;
          text.hops = hops;
          list.push({ text, path });
        }
      }

      prev = path;
      past = text;
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

    let text, path, data, list, node;
    const size = flat.length;
    for (var i = 0; i < size; i++) {
      [text, path] = Object.values(flat[i]);

      node = text.form ?? text;

      data = fuse.get(text.wrap) ?? new Map();
      (list = data.get(node))
        ? list.push({ text, path })
        : data.set(node, [{ text, path }]);

      fuse.set(text.wrap, data);
    }

    return {
      time: performance.now() - perf,
      dict: (this.fuse = fuse),
    };

  }
}
