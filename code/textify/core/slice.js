export function slice(tags) {
  
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
          node: tag == "TEXT" && key.textContent.length == 0 ? document.createTextNode(txt) : key,
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
}