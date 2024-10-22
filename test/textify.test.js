// @vitest-environment jsdom

import path from 'node:path';
import { promises as fs } from 'node:fs';

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { expect, test } from 'vitest'
import plainDOM from '../code/core/textify.js'

const __dirname = dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, 'data', 'quipu.html');

// write HTML file to document
document.open();
document.write(await readFile(filePath));
document.close();

// Create a Range object
let range = document.createRange();

// Set the start position of the range
range.setStart(document.querySelector('#mf-section-0 p:nth-of-type(2) i'), 0);

// Set the end position of the range
range.setEnd(document.querySelector('#mf-section-0 p:nth-of-type(2) :nth-child(8)'), 0);

// Add the range to the selection
let selection = window.getSelection();
selection.removeAllRanges();
selection.addRange(range);

const fragment = document.getSelection().getRangeAt(0).cloneContents()//template.content;

// write HTML file to template
/*const template = document.createElement('template');
  template.innerHTML = await readFile(filePath);
  const fragment = template.content;*/

test('test', () => {
  console.log(plainDOM(fragment).post.map(d => d.map(d => d.text).join('')).join(''))
})

async function readFile(path) {
  return fs.readFile(path, 'utf8', (err, data) => {
    if (err) {
      reject(err);
    } else {
      resolve(data);
    }
  })
}