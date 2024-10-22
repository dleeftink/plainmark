// @vitest-environment jsdom

import plainDOM from '../code/core/textify.js'
import readFile from './util/read.js';
import { expect, test } from 'vitest'

const from = import.meta.url;

// write HTML file to document
document.open();
document.write(await readFile('./data/quipu.html', from));
document.close();

// Create a Range object
let range = document.createRange();
let selection = window.getSelection();
let fragment = document.createDocumentFragment()

// write HTML file to template
/*const template = document.createElement('template');
template.innerHTML = await readFile(filePath);
const fragment = template.content;*/

test('Parse paragraph', () => {

  range.setStart(document.querySelector('#mf-section-0 p:nth-of-type(2) i'), 0);
  range.setEnd(document.querySelector('#mf-section-0 p:nth-of-type(2) :nth-child(8)'), 0);

  selection.removeAllRanges();
  selection.addRange(range);

  fragment = document.getSelection().getRangeAt(0).cloneContents();

  console.log(plainDOM(fragment).post.map(d => d.map(d => d.text).join('')))
})

test('Parse list', () => {

  range.setStart(document.querySelector('.mf-section-2 .mw-heading.mw-heading3'), 0);
  range.setEnd(document.querySelector('.mf-section-2 ul'), 0);

  selection.removeAllRanges();
  selection.addRange(range);

  fragment = document.getSelection().getRangeAt(0).cloneContents();

  console.log(plainDOM(fragment).post.map(d => d.map(d => d.text).join('')))
})
