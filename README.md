# plainmark
A library of plain Markdown tools.

## `new Textifier()`
Using the `textify()` method:

``` js

let textifier = new Textifier({ 
   
   skip: ["FIGCAPTION","FIGURE","NOSCRIPT"],
   keep: ["A"], // keep no matter what
   step: 8, // maxmimum traversal from text > root nodes
   hops: 1, // omit text nodes where the parent node is skipped multiple times
   same: 1, // omit text nodes where the same textContent is contained multiple times

}).textify();

let result = [...textifier.fuse]
  .map(([block,inline]) => [[block],...inline]
    .map(([wraps,texts],i)=> i > 0 ? texts.map(({text,path})=>text.textContent).join("") : wraps.tagName) //.join("").slice(0,32) + '...' 
)

console.log(result)

```
  