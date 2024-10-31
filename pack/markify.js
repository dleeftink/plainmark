export default class Markifier {
  constructor({} = {}) {
    this.form = null;
    this.wrap = null;
  }

  process(init) {

    return pipe;

  }

  reform(text, path) {
    let list = [],
      node;
    let span = path.length;

    let form =
      this.form ??
      (this.form = new this.dict({
        code: (text, node) => this.wrap(text, "`"),
        link: (text, node) => this.link(text, node.href),
        bold: (text, node) => this.wrap(text, "**"),
        emph: (text, node) => this.wrap(text, "*"),
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
    list.sort((a, b) => a[1] - b[1]);

    let prep,
      exit = text.textContent;
    for (let i = 0; i < span; i++) {
      prep = list[i].pipe;
      exit = ops(out, node);
    }

    return exit;

    function rule(node) {
      return {
        node,
        ...form[node.getTagname.split(/[1-6]/)[0]],
      };
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

  dict(rules) {

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

  lead(string, depth, symbol = "-", tabs) {
    tabs = tabs ?? "  ";
    return `${tabs.repeat(depth)}${symbol ?? depth + "."} ${string}`;

  }

  wrap(string, tag) {
    return `${tag}${string}${tag}`;

  }
}
