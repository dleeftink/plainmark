// @vitest-environment jsdom
// import Markifier from "../dist/markify.js";
// import Textifier from "../dist/textify.js";

import { openDoc } from "./util/read.js";
import { expect, expectTypeOf, test } from "vitest";

import { default as Textifier } from "../core/textify/index.js";
import { default as Markifier } from "../core/markify/index.js";

// write HTML file to document
await openDoc("./data/quipu.html", import.meta.url);

// Or write HTML file to template:
/* const template = document.createElement('template');
/* template.innerHTML = await readFile(filePath);
/* const fragment = template.content;*/

// Create a Range object
let range = document.createRange();
let selection = window.getSelection();
let fragment = document.createDocumentFragment();

// Instantiate base class
let textifier = new Textifier();
let markifier = new Markifier();

expect.extend({
  toBeOneOf: (received, expected) => {
    console.log(`${received} not in ${expected}`)
    return { 
      pass: expected.some(val => val === received), 
      message: ()=> `${received} not in ${expected.join('|')}`  
    }
  },
}, 'toBeOneOf');

expect.extend({
  toBeTextOrBR: (received) => {
    let pass;
    if(received?.nodeType == Node.TEXT_NODE) {
      passs = true
    } else if(received?.nodeType == Node.ELEMENT_NODE && received?.tagName == 'BR' ) {
      pass = true
    } else {
      pass = false
    }
    return { 
      pass,
      message: ()=> `oi`
    }
  },
}, 'toBeTextOrBR');


test("I/O", () => {
  
  range.setStart(
    document.body.firstChild,
    0,
    );
  range.setEnd(
    document.body.lastChild,
    0,
  );
      
  selection.removeAllRanges();
  selection.addRange(range);

  fragment = document.getSelection().getRangeAt(0).cloneContents();
  
  // clone the fragment, as textify consumes it
  let exit = textifier.textify(fragment);
  
  expect(exit).toMatchObject({ 
    base: expect.any(Object), 
    flat: expect.any(Array),
    fuse: expect.any(Map) 
  })

  expect(exit.flat[0]).toBeDefined
  expect(exit.flat[0].text).toBeTextOrBR();
  expect(exit.flat[0].path[0].nodeType).toEqual(Node.ELEMENT_NODE);

  expect(exit.time).toMatchObject({ 
    base: expect.any(Number), 
    flat: expect.any(Number),
    fuse: expect.any(Number) 
  })

  // test root traversal depth

  textifier.opts.step = 1;
  exit = textifier.textify(fragment);  
  expect(exit.flat[0].path.length == 1);

  textifier.opts.step = 0;
  exit = textifier.textify(fragment);
  expect(exit.flat[0].path.length == 0);

    console.log(
      "Completed in:", Object.values(exit.time).reduce((a,b)=>a+b,0)
    )

  }
);

test("Parse text", () => {

  textifier.opts.step = 8;
  
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

  let result = textifier.textify(fragment)

  let block = [...result.fuse]
    .map(([wrap,nest]) => [...nest]
      .map(([form,list])=>list
        .map(({text,path})=>text.textContent).join(""))
      .join(""))
    .join("\n")


    console.log(
      block

      //[...textifier.textify().fuse].map(([key,val])=> key.tagName + ' <- ' + val.map(d=>d.textContent).join("")).filter(d=>d.split('<-')[1].trim()).join('\n\n').replace(/\n\n\n/g,'\n\n')
    )

  }
);

test("Parse list", () => {

  textifier.opts.step = 8;

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

  let result = textifier.textify(fragment)

  let list = [...result.fuse]
    .map(([wrap,nest]) => [wrap.tagName,[...nest]
      .map(([form,list])=> list
        .map(({text,path})=>text.textContent).join(""))
      .join("").slice(0,32) + '...' 
    ])

    console.log(
      list
    )

  }
);


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

  textifier.opts.skip = [/*"BODY",*/"FIGCAPTION","FIGURE","NOSCRIPT"];
  textifier.opts.keep = ["A"];

  textifier.opts.hops = 2;
  textifier.opts.same = 2;

  let result = textifier.textify(fragment)

    console.log(
      result.flat.map(({text,path})=>[
        text.wrap?.tagName,
        text.hops,
        path.map(d=>d.tagName).join('>'),
        text.textContent.slice(0,32) + '...'
      ]).slice(0,8),
    )
  }
)
