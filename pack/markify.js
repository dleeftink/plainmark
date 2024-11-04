export default class Markifier {
  constructor({} = {}) {
    this.snip(["dict", "rule"]);

    this.reform();
    this.rewrap();
  }

  process(init) {

    return pipe;

  }

  reform(text = "", path = [], book = "form") {
    let list = [],
      node;
    let span = path.length;

    let rule = this.rule;
    let Rule = this.rule.prototype;

    Rule.book = book;

    let form =
      Rule[book] ??
      (Rule[book] = new this.dict({
        code: (text, node) => this.lock(text, "`"),
        link: (text, node) => this.link(text, node.href),
        bold: (text, node) => this.lock(text, "**"),
        emph: (text, node) => this.lock(text, "*"),
        none: (text, node) => text,
      }));

    for (let i = 0; i < span; i++) {
      node = path[i];
      list.push(new rule(node));
    }
    list = list.sort((a, b) => a.rank - b.rank);

    let pass = text?.textContent ?? text;
    for (let i = 0; i < span; i++) {
      let { node, pipe } = list[i];
      if (pipe == undefined) {
        continue;
      } else {
        pass = pipe(pass, node);
      }
    }

    return pass;

  }

  rewrap(text = "", path = [], book = "wrap") {
    let list = [],
      node;
    let span = path.length;

    let rule = this.rule;
    let Rule = this.rule.prototype;
    Rule.book = book;

    let wrap =
      Rule[book] ??
      (Rule[book] = new this.dict({
        para: (text, node, path) => text,
        list: (text, node, path) => nest(text, node, path),
        head: (text, node) =>
          this.lead(
            text,
            parseInt(node.tagName.split("H")[1] ?? 0),"#",           ),
        cite: (text, node, path) => text,
      }));

    let nest = (text, node, path) => {
      let filt = path.filter(
        (d) => d.tagName == "UL" || d.tagName =="OL",       );
      let self = filt[0];

      let sign =
        self.tagName == "UL"
          ? "-"
          : (self.count
              ? (self.count += 1)
              : ((self.count = 1), self.count)) + ".";

      return this.lead(text, filt.length - 1, "    ", sign);
    };

    for (let i = 0; i < span; i++) {
      node = path[i];
      list.push(new rule(node, path));
    }

    let pass = text;
    for (let i = 0; i < span; i++) {
      let { node, pipe, path } = list[i];
      if (pipe == undefined) {
        continue;
      } else {
        pass = pipe(pass, node, path);
      }
    }

    return pass;

  }

  link(string, href) {
    return `[${string}](${href})`;

  }

  lead(string, depth, tabs = "  ", symbol = "") {
    return `${tabs.repeat(depth)}${symbol ?? depth + "."} ${string}`;

  }

  lock(string, tag) {
    return `${tag}${string}${tag}`;

  }

  dict(rules) {

    Object.assign(this, { rule: { ...rules } });

    let tags = {
      B: { pipe: this.rule.bold, rank: 2 },
      I: { pipe: this.rule.emph, rank: 1 },
      A: { pipe: this.rule.link, rank: 3 },
      H: { pipe: this.rule.head, rank: 4 },

      CODE: { pipe: this.rule.code, rank: 1 },
      NONE: { pipe: this.rule.none, rank: 5 },

      P: { pipe: this.rule.para, rank: 6 },

      OL: { pipe: this.rule.list, rank: 6 },
      UL: { pipe: this.rule.list, rank: 6 },
      DIV: { pipe: this.rule.para, rank: 6 },
      BLOCKQUOTE: { pipe: this.rule.cite, rank: 6 },
    };

    for (let tag in tags) {
      if (tags[tag].pipe == undefined) delete tags[tag];
    }

    return tags;

  }

  rule(node, path = []) {
    return Object.assign(
      { node, path },
      this[this.book][node.tagName.split(/[1-6]/)[0]],
    );

  }

  snip(array) {

    return Object.defineProperties(
      this,
      Object.fromEntries(
        array.map((name) => [
          name,
          {
            enumerable: false,
            writeable: false,
            value: new Function(
              "return function " +
                this[name]
                  .toString()
                  .replace(/^function\s/, ""),
            ).call(),
          }]),
      ),
    );

  }
}
