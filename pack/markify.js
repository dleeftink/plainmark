export default class Markifier {
  constructor({} = {}) {
    this.base = { form: null, wrap: null };
  }

  process(init) {

    return pipe;

  }

  reform(text, path, mode = "form") {
    let list = [],
      node;
    let span = path.length;

    let rule = this.rule;
    let Rule = this.rule.prototype;

    let form =
      Rule[mode] ??
      ((Rule.mode = mode),
      (Rule[mode] = new this.dict({
        code: (text, node) => this.lock(text, "`"),
        link: (text, node) => this.link(text, node.href),
        bold: (text, node) => this.lock(text, "**"),
        emph: (text, node) => this.lock(text, "*"),
        head: (text, node) =>
          this.lead(
            text,
            parseInt(node.tagName.match(/\d+/)[0] ?? 0),"#",           ),
        none: (text, node) => text,
      })));

    for (let i = 0; i < span; i++) {
      node = path[i];
      list.push(new rule(node));
    }
    list = list.sort((a, b) => a.rank - b.rank);

    let pass = text.textContent;
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

  rewrap(text, path, mode = "wrap") {
    let list = [],
      node;
    let span = path.length;

    let rule = this.rule;
    let Rule = this.rule.prototype;

    let nest = (text, node, path) => {
      let filt = path.filter(
        (d) => d.tagName == "UL" || d.tagName =="OL",       );
      let self = filt[0];
      console.log(self);
      let sign =
        self.tagName == "UL"
          ? "-"
          : (self.count
              ? (self.count += 1)
              : ((self.count = 1), self.count)) + ".";

      return this.lead(text, filt.length - 1, "    ", sign);
    };

    let wrap =
      Rule[mode] ??
      ((Rule.mode = mode),
      (Rule[mode] = new this.dict({
        para: (text, node, path) => text,
        list: (text, node, path) => nest(text, node, path),
        cite: (text, node, path) => text,
      })));

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

  link(string, href) {
    let left = string.match(/^([\[\{\(]+)/)?.[0] ?? "";
    let right = string.match(/([\]\}\)]+$)/)?.[0] ?? "";

    return `${left}[${string.replace(/[\(\)\[\]\{\}]/g, "")}](${href})${right}`;

  }

  lead(string, depth, tabs = "  ", symbol = "") {
    return `${tabs.repeat(depth)}${symbol ?? depth + "."} ${string}`;

  }

  lock(string, tag) {
    return `${tag}${string}${tag}`;

  }

  rule(node, path = []) {
    return Object.assign(
      { node, path },
      this[this.mode][node.tagName.split(/[1-6]/)[0]],
    );

  }
}
