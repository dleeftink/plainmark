function plainDOM(fragment, keep = ["href"]) {
  let size;
  let dict = new Map();

    fragment = fragment instanceof DocumentFragment
        ? fragment
        : document.getSelection().rangeCount
          ? document.getSelection().getRangeAt(0).cloneContents()
          : document.createDocumentFragment();
  
  // traverse the fragment and clean-up attributes
  let walker = document.createTreeWalker(fragment, NodeFilter.SHOW_ALL);
  while ((node = walker.nextNode())) {
    if (node.children?.length == 0 || node.length > 0) {
      let tgt = node.parentElement ?? node;
      dict.set(node, tgt);

      let attributes = [...(tgt?.attributes || [])];
      let attr;

      while ((attr = attributes.pop()) !== undefined) {
        if (keep.includes(attr.name)) continue;
        tgt.removeAttribute(attr.name);
      }
    }
  }

  // prepare nodes for parent/child containment checks
  let prep = Array.from(dict)
    .map(([node, prev]) => ({
      text: node.textContent,
      node,
      group:
        (prev.tagName ? prev : undefined) ??
        (node.tagName ? node : undefined) ??
        (document.createElement("text")), // not really Text nodes,
      type:
        (node.tagName ? node : undefined) ??
        (prev.tagName ? prev : undefined) ??
        (document.createElement("text")), // not really Text nodes,
    }))
    .filter((d, i, f) => d.text != f[i - 1]?.text);

  // merge consecutive nodes in the same parent group
  let fuse = prep.reduce(
    (pool, item) => (
      (size = pool.length) && item.group == pool[size - 1][0].group
        ? pool[size - 1].push(item)
        : (pool[size] = [item]),
      pool
    ),
    [],
  );

  // check if inner or outer content is canonical
  let walk = fuse.map((inner) =>
    inner
      .map((d, i, f) => {
        let tgt = d.type.textContent !== d.group.textContent ? d.group.textContent : d.text;
        let ctx = d.group.tagName;
        let its = d.type.tagName;
        let txt = d.text;
        // txt = /\S.*\s.*\S/.test(txt) ? txt.trim() : txt; // trim if phrase -> should only be done in case of multiple sibling text nodes?
        let seq = f
          .filter((d) => d.text != "\n")
          .map((d) => d.text)
          .join("");

        let takeOuter = seq == tgt;
        let takeInner = ctx != its;

        let type = takeOuter ? ctx : takeInner ? its : undefined;
        let subs =
          txt.length > 1 && its != "TEXT"
            ? { find: { node: /*d.type*/ d.node, type: its, text: txt } }
            : undefined;
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

  // per group, wrap items with same parent node into a single Map() entry
  // note: not all parent/child relations have been tested

  let wrap = walk
    .filter((d) => d.length)
    .map((inner) =>
      inner.reduce((pool, item) => {
        if (item.node && pool.has(item.node)) {
          pool.get(item.node).push(item);
        } else if (item.node) {
          pool.set(Object.assign(item.node, { line: item.text, type: item.type }), [item]);
        }
        return pool;
      }, new Map()),
    );

  function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  let row = 0;
  let post = wrap
    .map((inner) =>
      [...inner]
        .filter(
          ([key, val]) =>
            key.line && key.type && val && val.some((d) => d.text && d.text.replace(/[\s\n]+/g, "").length > 0),
        )
        .map(([key, val]) => {
          let freq = {};
          let tgt = key.line;
          let tag = key.type;
          let sub = val
            .filter((d) => d.find)
            .map(
              ({ find }, i) => (
                freq[find.text] ? freq[find.text]++ : (freq[find.text] = 1),
                { idx: i, nth: freq[find.text], ...find }
              ),
            )
            .sort((a, b) => b.text.length - a.text.length);

          for (let i = 0; i < sub.length; i++) {
            let count = 0;
            let row = sub[i]; // note: rows are successive substitutions, not input data rows

            // delimit substring matches
            // might not handle complex string patterns, non-ascii or substrings well
            let rgx = escapeRegex(row.text).replace(/^([\S]?)\b|\b([\S]?)$/gm, "\\b$1$2");

            // replacer is used to accumulate the subsitution rows with proper offsets for each item
            tgt.replace(new RegExp(rgx, "gm"), (text, from, full) =>
              row.nth == (count += 1)
                ? ((row.from = from),
                  (row.till = from + text.length) /*- 1*/,
                  console.log("Wrapped:", row.nth, count, from, row.text, "in:", text, "with:", row.type),
                  text)
                : text,
            );
          }

          delete key.line;
          delete key.type;

          if (key.removeAttribute) {
            key.removeAttribute("type");
            key.removeAttribute("line");
          }

          let cnt = 0;
          let src = {
            row: row++,
            col: cnt,
            seq: null,
            ctx: key.parentElement ?? key,
            nth: 0,
            node: tag == "TEXT" && key.textContent.length == 0 ? document.createTextNode(tgt) : key,
            type: tag,
            text: tgt,
            from: 0,
            till: tgt.length,
          };

          let out = sub
            .sort((a, b) => a.idx - b.idx)
            .flatMap(({ idx, ...d }, j, f) => {
              let from = d.from;
              let till = d.from + d.text.length;
              let next = f[j + 1]?.from ?? src.text.length;

              let preSlice = j == 0 ? src.text.slice(0, from) : undefined;
              let postSlice = till < next ? src.text.slice(till, next) : undefined;

              let prep = [];
              if (preSlice) {
                prep[0] = {
                  ...src,
                  col: cnt++,
                  from: 0,
                  till: from,
                  text: preSlice,
                  node: document.createTextNode(preSlice),
                };
              }

              let self = {
                row,
                col: cnt++,
                seq: null,
                ctx: src.ctx,
                ...d,
              };

              let post = [];
              if (postSlice) {
                post[0] = {
                  ...src,
                  col: cnt++,
                  from: till,
                  text: postSlice,
                  node: document.createTextNode(postSlice),
                };
              }

              let tuple = [...prep, self, ...post];
              return tuple;
            })
            .concat(sub.length == 0 ? src : []);
          return out;
        }),
    )
    .flat();

  post.flat().forEach((node, i, f) => {
    let prev = f[i - 1];
    let next = f[i + 1];
    if (prev) Object.assign(node, { prev }, { seq: i });
    if (next) Object.assign(node, { next }, { seq: i });
  });

  return {
    walk,
    wrap,
    post,
  };
}