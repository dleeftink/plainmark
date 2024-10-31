export default class Markifier {
  constructor({} = {}) {
    this.base = { form: null, wrap: null };
  }

  process(init) {

    return pipe;

  }

  reform(text, path) {
    let list = [],
      node;
    let span = path.length;

    let form =
      this.base.form ??
      (this.base.form = new this.dict({
        code: (text, node) => this.lock(text, "`"),
        link: (text, node) => this.link(text, node.href),
        bold: (text, node) => this.lock(text, "**"),
        emph: (text, node) => this.lock(text, "*"),
        head: (text, node) =>
          this.lead(
            text,
            parseInt(node.tagName.match(/\d+/)[0] ?? 0),"#",           ),
        none: (text, node) => text,
      }));

    for (let i = 0; i < span; i++) {
      node = path[i];
      list.push(new rule(node));
    }
    list.sort((a, b) => a.rank - b.rank);

    let prep,
      item,
      exit = text.textContent;
    for (let i = 0; i < span; i++) {
      item = list[i];
      prep = item.pipe;
      node = item.node;
      exit = prep(exit, node);
    }

    return list;

    function rule(node) {
      return Object.assign(
        { node },
        form[node.tagName.split(/[1-6]/)[0]],
      );
    }

  }

  rewrap(pipe) {

    let cnt = 1;
    return pipe.map((row) =>
      row.map(({ exit, ...d }, i, f) => {
        let out = exit;
        switch (true) {
          case i == 0 &&
            f.every((d) => d.ctx.tagName == "OL"):
            out = d.ctx.innerHTML;
            break;

          case i == 0 &&
            f.every((d) => d.ctx.tagName == "UL"):
            out = d.ctx.innerHTML;
            break;

          case /h1-6/.test(d.type):
            out = this.lead(
              out,
              parseInt(d.type.match(/\d+/)[0] ?? 0),"#",             );
            break;

          default:
            out = out;
        }
        return { ...d, exit: out };
      }),
    );

  }

  dict(rules, deps) {
    Object.assign(this, { rule: { ...rules } });

    return {
      B: { pipe: this.rule.bold, rank: 2 },
      I: { pipe: this.rule.emph, rank: 1 },
      A: { pipe: this.rule.link, rank: 3 },
      H: { pipe: this.rule.head, rank: 4 },

      CODE: { pipe: this.rule.code, rank: 1 },
      NONE: { pipe: this.rule.none, rank: 5 },
    };

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
}
