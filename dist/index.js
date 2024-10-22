export default class Textifier {
  
  constructor({
    keep = ["href"],
    drop = ["noscript"],
  } = {}) {
    this.opts = { keep, drop };
  }

  textify(fragment) {

    fragment = this.recheck(fragment);

    let dict = this.restore(fragment);
    let fuse = this.regroup(dict);

    let walk = this.rematch(fuse);
    let wrap = this.retrace(walk);

    let tags = this.realign(wrap);
    let post = this.reslice(tags);

    post.flat().forEach((item, i, f) => {
      let prev = f[i - 1];
      let next = f[i + 1];
      if (prev) Object.assign(item, { prev }, { seq: i });
      if (next) Object.assign(item, { next }, { seq: i });
    });

    return {
      walk,
      wrap,
      post,
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

  restore(fragment) {

    let dict = new Map();
    let keep = this.opts.keep;

    let branch;
    let node,
      walker = document.createTreeWalker(
        fragment,
        NodeFilter.SHOW_ALL,
      );

    let drop = this.opts.drop.map((d) => d.toUpperCase());

    while ((node = walker.nextNode())) {
      if (
        node.parentElement == undefined &&
        node.nodeType == Node.ELEMENT_NODE
      ) {
        node.dataset.branch = branch++;
      }

      if (node.children?.length == 0 || node.length > 0) {
        let tgt = node.parentElement ?? node;
        if (
          drop.includes(node.tagName) ||
          drop.includes(node.parentElement?.tagName)
        )
          continue;

        dict.set(node, tgt);

        let attributes = [...(tgt?.attributes || [])];
        let attr;

        while ((attr = attributes.pop()) !== undefined) {
          if (keep.includes(attr.name)) continue;
          tgt.removeAttribute(attr.name);
        }

        if (
          tgt.nodeType == Node.ELEMENT_NODE &&
          tgt.dataset.depth == undefined
        ) {
          let leaf = tgt;
          let nest = -1;
          while (leaf && leaf.parentNode) {
            nest++;
            if (
              drop.includes(leaf.tagName) ||
              drop.includes(leaf.parentNode?.tagName)
            )
              dict.delete(node);
            leaf = leaf.parentNode;
          }
          tgt.dataset.depth = nest;
        }
      }
    }

    return dict;

  }

  regroup(dict) {

    let prep = Array.from(dict)
      .map(([node, prev]) => ({
        text: node.textContent,
        node,
        group:
          (prev.tagName ? prev : undefined) ??
          (node.tagName ? node : undefined) ??
          document.createElement("text"),
        type:
          (node.tagName ? node : undefined) ??
          (prev.tagName ? prev : undefined) ??
          document.createElement("text"),
      }))
      .filter((d, i, f) => d.text != f[i - 1]?.text);

    let size;
    let fuse = prep.reduce(
      (pool, item) => (
        (size = pool.length) &&
        item.group == pool[size - 1][0].group
          ? pool[size - 1].push(item)
          : (pool[size] = [item]),
        pool
      ),
      [],
    );

    return fuse;

  }

  rematch(fuse) {

    let nogo = ["SPAN", "STYLE"];

    return fuse.map((inner) =>
      inner
        .map((d, i, f) => {
          let tgt =
            d.type.textContent !== d.group.textContent
              ? d.group.textContent
              : d.text;
          let ctx = d.group.tagName;
          let its = d.type.tagName;
          let txt = d.text;

          let seq = f
            .filter((d) => d.text != "\n")
            .map((d) => d.text)
            .join("");

          let takeOuter = seq == tgt;
          let takeInner = ctx != its;

          let type = takeOuter
            ? ctx
            : takeInner
              ? its
              : undefined;
          let subs =
            txt.length > 1 && its != "TEXT"
              ? {
                  find: {
                    node: d.node,
                    type: its,
                    text: txt,
                  },
                }
              : undefined;
          let text = takeOuter
            ? seq
            : takeInner
              ? txt
              : undefined;

          let node = takeOuter
            ? d.group
            : takeInner
              ? d.node
              : undefined;

          return { node, type, text, ...subs };
        })

        .filter(
          (d) =>
            !nogo.includes(d.type) && (d.text || d.find),
        )

        .filter(
          (d, i, f) =>
            !f[i - 1]?.text?.includes(d?.find?.text) &&
            !f[i + 1]?.text?.includes(d?.find?.text),
        )

        .filter(
          (d, i, f) =>
            (d.type != f[i - 1]?.type &&
              d.text != f[i - 1]?.text) ||
            d.find,
        )

        .map((d) =>
          d.find &&
          d.type == d.find.type &&
          d.text == d.find.text
            ? { ...d.find }
            : d,
        )

        .map((d) =>
          !d.type && !d.text ? { ...d.find } : d,
        ),
    );

  }

  retrace(walk) {

    return walk
      .filter((d) => d.length)
      .map((inner) =>
        inner.reduce((pool, item) => {
          if (item.node && pool.has(item.node)) {
            pool.get(item.node).push(item);
          } else if (item.node) {
            pool.set(
              Object.assign(item.node, {
                line: item.text,
                type: item.type,
              }),
              [item],
            );
          }
          return pool;
        }, new Map()),
      );

  }

  realign(wrap) {

    function escapeRegex(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    return wrap.map((inner) =>
      [...inner]
        .filter(
          ([key, val]) =>
            key.line &&
            key.type &&
            val &&
            val.some(
              (d) =>
                d.text &&
                d.text.replace(/[\s\n]+/g, "").length > 0,
            ),
        )
        .map(([key, val]) => {
          let freq = {};
          let txt = key.line;
          let tag = key.type;
          let sub = val
            .filter((d) => d.find)
            .map(
              ({ find }, i) => (
                freq[find.text]
                  ? freq[find.text]++
                  : (freq[find.text] = 1),
                { idx: i, nth: freq[find.text], ...find }
              ),
            )
            .sort((a, b) => b.text.length - a.text.length);

          for (let i = 0; i < sub.length; i++) {
            let count = 0;
            let item = sub[i];

            let rgx = escapeRegex(item.text).replace(
              /^([\S]?)\b|\b([\S]?)$/gm,
              "\\b$1$2",
            );

            txt.replace(
              new RegExp(rgx, "gm"),
              (text, from, full) =>
                item.nth == (count += 1)
                  ? ((item.from = from),
                    (item.till = from + text.length),
                    console.log(
                      "Wrapped:",
                      item.nth,
                      count,
                      from,
                      item.text,
                      "in:",
                      text,
                      "with:",
                      item.type,
                    ),
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

          return { key, tag, txt, sub };
        }),
    );

  }

  reslice(tags) {

    let row = 0;
    return tags
      .map((inner) =>
        inner.map(({ key, tag, txt, sub }) => {
          let cnt = 0;
          let src = {
            row: row++,
            col: cnt,
            seq: null,
            ctx: key.parentElement ?? key,
            nth: 0,
            node:
              tag == "TEXT" && key.textContent.length == 0
                ? document.createTextNode(txt)
                : key,
            type: tag,
            text: txt,
            from: 0,
            till: txt.length,
          };

          let out = sub
            .sort((a, b) => a.idx - b.idx)
            .flatMap(({ idx, ...d }, j, f) => {
              let from = d.from;
              let till = d.from + d.text.length;
              let next = f[j + 1]?.from ?? src.text.length;

              let preSlice =
                j == 0
                  ? src.text.slice(0, from)
                  : undefined;
              let postSlice =
                till < next
                  ? src.text.slice(till, next)
                  : undefined;

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

  }
}
