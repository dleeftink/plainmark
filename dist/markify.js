export default class Markifier {
  constructor({} = {}) {
    this.data;

  }

  process(init) {

    let pipe = this.parseTags(init);
    pipe = this.parseLine(pipe);

    return pipe;

  }

  parseTags(init) {

    return init.map((row) =>
      row
        .map(({ type, ...d }) => ({
          type: type.toLowerCase(),
          ...d,
        }))
        .map((d) => {
          let out = d.text;

          if (d.type == "code") out = this.wrap(text, "`");
          if (d.type == "a")
            out = this.link(out, d.node.href);
          if (d.type == "b") out = this.wrap(out, "**");
          if (d.type == "i") out = this.wrap(out, "*");
          return { ...d, exit: out };
        }),
    );

  }

  parseLine(pipe) {

    return pipe.map((row) =>
      row.map(({ exit, ...d }, i, f) => {
        let out = exit;
        switch (true) {
          case i == 0 &&
            f.every((d) => d.ctx.tagName == "OL"):
            out = this.lead(out, d.node?.dataset?.depth);
            break;

          case i == 0 &&
            f.every((d) => d.ctx.tagName == "UL"):
            out = this.lead(
              out,
              d.node?.dataset?.depth,
              null,
            );
            break;

          case d.type.test("h[1-6]"):
            out = this.lead(
              out,
              parseInt(d.type.match(/\d+/)[0]),
              "#",
            );
            break;

          default:
            out = out;
            return { ...d, exit: out };
        }
      }),
    );

  }

  link(string, href) {
    let left = string.match(/^([\[\{\(]+)/);
    let right = string.match(/([\]\}\)]+$)/);

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
