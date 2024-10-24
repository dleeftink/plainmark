// @vitest-environment jsdom

import plainDOM from "../code/core/textify.js";
import Textifier from "../code/textify/index.js";
//import Textifier from "../dist/index.js";
import { openDoc } from "./util/read.js";
import { expect, test } from "vitest";

// write HTML file to document
await openDoc("./data/quipu.html", import.meta.url);

// Create a Range object
let range = document.createRange();
let selection = window.getSelection();
let fragment = document.createDocumentFragment();
let textifier = new Textifier(); //{ textify:plainDOM }; 

test("Parse text", () => {
  range.setStart(
    document.querySelector("#mf-section-0 p:nth-of-type(2) i"),
    0,
  );
  range.setEnd(
    document.querySelector("#mf-section-0 p:nth-of-type(2) :nth-child(8)"),
    0,
  );

  selection.removeAllRanges();
  selection.addRange(range);

  fragment = document.getSelection().getRangeAt(0).cloneContents();

  console.log(
    textifier.textify(fragment).post.map((d) => d.map((d) => d.text).join("")).join(""),
  );
});

test("Parse list", () => {
  range.setStart(
    document.querySelector(".mf-section-2 .mw-heading.mw-heading3"),
    0,
  );
  range.setEndAfter(
    document.querySelector(".mf-section-2 ul:last-of-type"),
  );

  selection.removeAllRanges();
  selection.addRange(range);

  fragment = document.getSelection().getRangeAt(0).cloneContents();

  console.log(
    textifier.textify(fragment).post
      .filter((row) => row.every((d) => d.type == "LI"))
         .map((row) => row.map((d, i, f) => {
            let depth = 0;
            if(i == 0 && d.col == 0) {
              depth = parseInt(d.node?.dataset?.depth ?? parseInt(d.ctx?.dataset?.depth))
            }
            return {depth,eval:d.text}
           })
          //.join(""),
      ).flat()
  );
});


test("Filter nodes", () => {
  range.setStart(
    document.querySelector(".mf-section-2 figure"),
    0,
  );
  range.setEnd(
    document.querySelector(".mf-section-2 p:nth-of-type(3)"),
    0
  );

  selection.removeAllRanges();
  selection.addRange(range);

  fragment = document.getSelection().getRangeAt(0).cloneContents();
  textifier.opts.drop = ["img","noscript","figure"];

  console.log(
    textifier.textify(fragment).post.flat().map(d=>d.text).join("")
  )
  }
)

// write HTML file to template
/*const template = document.createElement('template');
template.innerHTML = await readFile(filePath);
const fragment = template.content;*/