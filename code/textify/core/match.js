export function match(fuse) {

  return fuse.map((inner) =>
    inner
      .map((d, i, f) => {
        let tgt = d.type.textContent !== d.group.textContent ? d.group.textContent : d.text;
        let ctx = d.group.tagName;
        let its = d.type.tagName;
        let txt = d.text;
       
        let seq = f
          .filter((d) => d.text != "\n")
          .map((d) => d.text)
          .join("");

        let takeOuter = seq == tgt;
        let takeInner = ctx != its;

        let type = takeOuter ? ctx : takeInner ? its : undefined;
        let subs = txt.length > 1 && its != "TEXT" ? { find: { node: /*d.type*/ d.node, type: its, text: txt } } : undefined;
        let text = takeOuter ? seq : takeInner ? txt : undefined;

        let node = takeOuter ? d.group : takeInner ? d.node : undefined;

        return { node, type, text, ...subs };
      })

      // exclude top-level spans and style elements || keep 'find' and replace candidates
      .filter((d) => !["SPAN", "STYLE"].includes(d.type) && (d.text || d.find))

      // exclude surrounding nodes contained in current node
      .filter((d, i, f) => !f[i - 1]?.text?.includes(d?.find?.text) && !f[i + 1]?.text?.includes(d?.find?.text))

      // exclude consecutive duplicate nodes with same type/content
      .filter((d, i, f) => (d.type != f[i - 1]?.type && d.text != f[i - 1]?.text) || d.find)

      // exclude nodes with identical substitutions
      .map((d) => (d.find && d.type == d.find.type && d.text == d.find.text ? { ...d.find } : d))

      // hoist substitutions to empty top-level nodes
      .map((d) => (!d.type && !d.text ? { ...d.find } : d)),
  );

}