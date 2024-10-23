export function parseTags(init) {
  return init.map(row => row
    .map(({ type, ...d }) => ({ type: type.toLowerCase(), ...d }))
    .map((d) => {
      let out = d.text;

      if (d.type == "code") out = this.wrap(text, '`');
      if (d.type == "a") out = this.link(out, d.node.href);
      if (d.type == "b") out = this.wrap(out, '**');
      if (d.type == "i") out = this.wrap(out, '*');
      return { ...d, exit: out };

    })
  );
}