import { expect, expectTypeOf, test } from "vitest";

import { default as Markifier } from '../core/markify/index.js'

let markifier = new Markifier()

test("I/O", () => {
  let link = document.createElement('a');
  link.setAttribute('href','https://localhost')

  let exitForm = markifier.reform(
    document.createTextNode('hello'),
    [document.createElement('i'),document.createElement('b'),/*document.createElement('h4'),*/link]
  )

  let ord1 = document.createElement('ol')
  let li = document.createElement('li')
  let exitWrap = markifier.rewrap(
    exitForm, [document.createElement('li'),ord1]
  )

  let exitWrap2 = markifier.rewrap(
    exitForm, [document.createElement('li'),document.createElement('ol')],2
  )
  
  console.log(
    // exitForm,
    exitWrap+'\n'+exitWrap2 
  )
    
    
  }
)