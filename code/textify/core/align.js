export function align(wrap) {
  
  function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  return wrap.map((inner) =>
    [...inner]
      .filter(([key, val]) => key.line && key.type && val && val.some((d) => d.text && d.text.replace(/[\s\n]+/g, "").length > 0))
      .map(([key, val]) => {
        let freq = {};
        let txt = key.line;
        let tag = key.type;
        let sub = val
          .filter((d) => d.find)
          .map(
            ({ find }, i) => (
              freq[find.text] ? freq[find.text]++ : (freq[find.text] = 1), { idx: i, nth: freq[find.text], ...find }
            ),
          )
          .sort((a, b) => b.text.length - a.text.length);

        for (let i = 0; i < sub.length; i++) {
          let count = 0;
          let item = sub[i]; // note: rows are successive substitutions, not input data rows

          // delimit substring matches
          // might not handle complex string patterns, non-ascii or substrings well
          let rgx = escapeRegex(item.text).replace(/^([\S]?)\b|\b([\S]?)$/gm, "\\b$1$2");

          // replacer is used to accumulate the subsitution rows with proper offsets for each item
          txt.replace(new RegExp(rgx, "gm"), (text, from, full) =>
            item.nth == (count += 1)
              ? ((item.from = from),
                (item.till = from + text.length) /*- 1*/,
                console.log("Wrapped:", item.nth, count, from, item.text, "in:", text, "with:", item.type),
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

        return { key, tag, txt, sub }; // tgt == text
        
      }),
  )
}