import { expect, expectTypeOf, test } from "vitest";

import { default as Markifier } from '../core/markify/index.js'

let markifier = new Markifier()

test("I/O", () => {
  let link = document.createElement('a');
  link.setAttribute('href','https://localhost')
  console.log(
    markifier.reform(
      document.createTextNode('hello'),
      [document.createElement('i'),document.createElement('b'),document.createElement('h4'),link])
    )
  }
)