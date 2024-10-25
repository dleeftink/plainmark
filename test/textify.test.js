// @vitest-environment jsdom
import Markifier from "../dist/markify.js";
 import Textifier from "../dist/textify.js";

import { openDoc } from "./util/read.js";
import { expect, expectTypeOf, test } from "vitest";

import { default as Textifier } from "../core/textify/index.js";
//import { default as Markifier } from "../core/markify/index.js";


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
  
  let exit = textifier.textify(fragment);
  
  expect(exit).toMatchObject({ 
    base: expect.any(Map), 
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

    console.log(
      "Completed in:", Object.values(exit.time).reduce((a,b)=>a+b,0)
    )

  }
);

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
      [...textifier.textify(fragment).fuse].map(([_,val])=> val.map(d=>d.textContent).join(''))[0] , '\n' ,
      [...textifier.textify().fuse].map(([key,val])=> key.tagName + ' <- ' + val.map(d=>d.textContent).join("")).filter(d=>d.split('<-')[1].trim()).join('\n\n').replace(/\n\n\n/g,'\n\n')
    )

  }
);

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

  textifier.opts.skip = ["FIGCAPTION","FIGURE","SUP"]

    console.log(
      //textifier.textify(fragment).dict.flat.map(d=>d.text.textContent)
      [...textifier.textify(fragment).fuse].map(([key,val])=> [key?.tagName,val.map(d=>d.textContent).join('').slice(0,16) + '...' ])
    )
  }
)
