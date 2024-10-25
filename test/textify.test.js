// @vitest-environment jsdom
// import Markifier from "../dist/markify.js";
// import Textifier from "../dist/textify.js";

import { default as Textifier } from "../code/textify/index.js";
import { default as Markifier } from "../code/markify/index.js";

import { openDoc } from "./util/read.js";
import { expect, test } from "vitest";

// write HTML file to document
await openDoc("./data/quipu.html", import.meta.url);

// alternatively, write HTML file to template
// const template = document.createElement('template');
// template.innerHTML = await readFile(filePath);
// const fragment = template.content;

// Create a Range object
let range = document.createRange();
let selection = window.getSelection();
let fragment = document.createDocumentFragment();

// Instantiate base class
let textifier = new Textifier();
let markifier = new Markifier();

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
    //textifier.textify(fragment).dict.flat.map(d=>d.text.textContent)
    [...textifier.textify(fragment).fuse].map(([_,val])=> val.map(d=>d.textContent).join(''))[0]

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
    //textifier.textify(fragment).dict.flat.map(d=>d.text.textContent)
    [...textifier.textify(fragment).fuse].map(([key,val])=> [key.tagName,val.map(d=>d.textContent).join('').slice(0,16) + '...' ])
  );
});


test.todo("Filter nodes", () => {
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

  console.log(
    textifier.textify(fragment).dict.flat.map(d=>d.text.textContent)
  )
  }
)
