function plaindown(post) {

  // expects plainDOM().post output

  let init = post; 

  // process basic formatting tags
  let cnt = 1;
  let prep = init.map((row) =>
    row
      //.filter((d) => d.text.replace(/\s\n+/, "").length > 0)
      .map(({ type, ...d }) => ({ type: type.toLowerCase(), ...d }))
      .map((d) => {
        let out = d.text;

        if (d.type == "a") out = `[${out.replace(/[\[\]]/g, "")}](${d.node.href})`;
        if (d.type == "i") out = `*${out}*`;
        if (d.type == "code") out = `\`${out}\``;
        return { ...d, exit: out };
      }),
  );

  let wrap = prep.map((row) =>
    row.map(({ exit, ...d }, i, f) => {
      let out = exit;
      switch (true) {
      
        case i == 0 && f.some((d) => d.ctx.tagName == "OL"):
          out = `\n${cnt++}. ${out}`;
          break;
          
        case i == 0 && f.some((d) => d.ctx.tagName == "UL"):
          out = `\n- ${out}`;
          break;

        case d.type.startsWith("h"):
          //out = `${"#".repeat(parseInt(d.type.match(/\d/)[0]))} ${d.text}`;
          out = `#### ${out}\n`;
          break;
          
        default:
          out = out;
      }
      return { ...d, exit: out };
    }),
  );
  return wrap;
}

// console.log(plaindown(plainDOM().post).flat().map((d) => d.exit).join(""));

export default { plaindown }