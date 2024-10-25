export function parseLine(pipe) {
  let cnt = 1;
  return pipe.map((row) =>
    row.map(({ exit, ...d }, i, f) => {
      let out = exit;
      switch (true) {

        case i == 0 && f.every((d) => d.ctx.tagName == "OL"):
          out = d.ctx.innerHTML //'\n' + this.lead(d.ctx.tagName + out, d.node?.dataset?.depth,cnt++)
          break;

        case i == 0 && f.every((d) => d.ctx.tagName == "UL"):
          out = d.ctx.innerHTML // '\n' + this.lead(d.ctx.tagName  + out, d.node?.dataset?.depth)
          break;

        case /h1-6/.test(d.type):
          out = this.lead(out, parseInt(d.type.match(/\d+/)[0] ?? 0), '#')
          break;

        default: out = out;
         
      }
      return { ...d, exit: out }
    })
  )
}