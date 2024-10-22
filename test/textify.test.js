// @vitest-environment jsdom

import plainDOM from "../code/core/textify.js";
import readFile from "./util/read.js";
import { expect, test } from "vitest";

const from = import.meta.url;

// write HTML file to document
document.open();
document.write(await readFile("./data/quipu.html", from));
document.close();

// Create a Range object
let range = document.createRange();
let selection = window.getSelection();
let fragment = document.createDocumentFragment();

// write HTML file to template
/*const template = document.createElement('template');
template.innerHTML = await readFile(filePath);
const fragment = template.content;*/

test("Parse paragraph", () => {
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
    plainDOM(fragment).post.map((d) => d.map((d) => d.text).join("")),
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
    plainDOM(fragment)
      .post.filter((row) => row.some((d) => d.type == "LI"))
      .map((row) =>
        row
          .map(
            (d, i, f) =>
              (i == 0
                ? (d.node?.dataset?.depth ??
                    parseInt(d.ctx?.dataset?.depth ?? 0) + 1) + "| "
                : "") + d.text,
          )
          .join(""),
      ),
  );
});
