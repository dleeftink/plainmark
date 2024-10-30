# plainmark
A library of plain Markdown tools.

## `new Textifier()`

Uses a `TreeWalker` to visit text nodes and merge newlines to preceding parent elements.
For each textNode, determines whether a tag is `phrasing` or `blocking` and builds a nested map that groups textNodes by the closest `blocking` node, and subgroups them by the farthest `phrasing` node.
This allows you to apply styling rules on `phrasing` elements separately from `blocking` elements.
> Expects a `DocumentFragment` as input or retrieves the current text selection when none provided

## Selection to structured text
> Using `textify()` on a `DocumentFragment`

``` js

let fragment = document.getSelection().getRangeAt(0);
    fragment = fragment ? fragment.cloneContents() : document.createDocumentFragment();

let textifier = new Textifier({ 
   
   skip: ["FIGCAPTION","FIGURE","NOSCRIPT"],
   keep: ["A"], // keep these no matter what
   step: 8, // traversal from text to root node
   hops: 3, // drop text when the parent node is skipped more than
   same: 2, // drop text when the same textContent is contained more than

}).textify(fragment);

let result = [...textifier.fuse]
  .map(([block,inline]) => [[block],...inline]
    .map(([wraps,lines],i)=> i == 0 ? wraps.tagName : lines
      .map(({text,path})=>text.textContent).join("")
    ) //.join("").slice(0,16) + '...' 
)

console.log([
  ["H2", "Etymology", "\n"],
  ["P", "Quipu", " is a Quechua word meaning 'knot' or 'to knot'.", "[16]"],
])
```

## Fragment to bracketed text 
> Using `textify()` on a `TemplateFragment`

```js
let HTMLFrag = `
  <article>
    <hgroup><h3>Some title</h3></hgroup>
    <section>
      <p>Content<a href="#"><span>[</span>1<span>]</span></a>that is <i><b>styled</b></i>\n</p>
    </section>
  </article>`

let template = document.createElement('template');
    template.innerHTML = HTMLFrag;

let textifier = new Textifier({ 
   
   keep: ["A","SECTION"], // keep no matter what
   step: 8, // traversal from text > root nodes
   hops: 2, // drop text when the parent node is skipped multiple times
   same: 2, // drop text when the same textContent is contained multiple times

}).textify(template.content);

// return TAG:{text}
let result = [...textifier.fuse]
  .map(([block,inline]) => [[block],...inline]
    .map(([wraps,lines],i)=> i == 0 ? wraps.tagName : (wraps.tagName ?? 'T') + ':{' + lines
      .map(({text,path})=> {
        
        let forms = path
          .filter(node=>node.kind.has('phrasing'))
          .filter(node=> node.tagName !== 'SPAN' && node !== wraps);

        let formString = forms.map(node=>node.tagName).reverse().join(':')
        return (forms.length ? formString+':{' : '') + text.textContent
      
      }).join('') + '}'
    )
)

// Text contents <T> are grouped by closest blocking parent node:
// <H3> inside of <HGROUP> = H3
// <P> inside of <SECTION> = P

console.log([
  ["BODY", "BR:{\n}"],
  ["H3", "T:{Some title}", "BR:{\n}"],
  ["P", "T:{Content}", "A:{[1]}", "T:{that is }", "I:{B:{styled}", "BR:{\n}"],
])
```
