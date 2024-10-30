# plainmark
A library of plain Markdown tools.

## `new Textifier()`
Using the `textify()` method:

``` js

let textifier = new Textifier({ 
   
   skip: ["FIGCAPTION","FIGURE","NOSCRIPT"],
   keep: ["A"], // keep no matter what
   step: 8, // traversal from text > root nodes
   hops: 2, // drop text when the parent node is skipped multiple times
   same: 1, // drop text when the same textContent is contained multiple times

}).textify();

let result = [...textifier.fuse]
  .map(([block,inline]) => [[block],...inline]
    .map(([wraps,texts],i)=> i == 0 ? wraps.tagName : texts
      .map(({text,path})=>text.textContent).join("")
    ) //.join("").slice(0,32) + '...' 
)

console.log(result)

```
  