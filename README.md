# plainmark
A library of plain Markdown tools.

## `new Textifier()`
Uses a `TreeWalker` to visit text nodes and merge newlines to preceding parent elements.

### Selection to structured text
> Using the `textify()` method on a `DocumentFragment`

``` js

let fragment = document.getSelection().getRangeAt(0);
    fragment = fragment ? fragment.cloneContents() : document.createDocumentFragment();

let textifier = new Textifier({ 
   
   skip: ["FIGCAPTION","FIGURE","NOSCRIPT"],
   keep: ["A"], // keep no matter what
   step: 8, // traversal from text > root nodes
   hops: 2, // drop text when the parent node is skipped multiple times
   same: 2, // drop text when the same textContent is contained multiple times

}).textify(fragment);

let result = [...textifier.fuse]
  .map(([block,inline]) => [[block],...inline]
    .map(([wraps,texts],i)=> i == 0 ? wraps.tagName : texts
      .map(({text,path})=>text.textContent).join("")
    ) //.join("").slice(0,32) + '...' 
)

console.log(result)

```

### Fragment to bracketed text 
> Using the `textify()` method on a `TemplateFragment`

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
   
   skip: ["FIGCAPTION","FIGURE","NOSCRIPT","SUP"],
   keep: ["A","SECTION"], // keep no matter what
   step: 8, // traversal from text > root nodes
   hops: 2, // drop text when the parent node is skipped multiple times
   same: 2, // drop text when the same textContent is contained multiple times

}).textify(template.content);

// return TAG:{text}
let result = [...textifier.fuse]
  .map(([block,inline]) => [[block],...inline]
    .map(([wrap,line],i)=> i == 0 ? wrap.tagName : (wrap.tagName ?? 'T') + ':{' + line
      .map(({text,path})=> {
        let forms = path.filter(n=>n.kind.has('phrasing') && n.tagName !== 'SPAN' && n !== wrap)
        let formString = forms.map(d=>d.tagName).reverse().join(':')
        return (forms.length ? formString+':{' : '') + text.textContent
      }).join('') + '}'
    )
)

console.log([
  ["BODY", "BR:{\n}"],
  ["H3", "T:{Some title}", "BR:{\n}"],
  ["P", "T:{Content}", "A:{[1]}", "T:{that is }", "I:{B:{styled}", "BR:{\n}"],
])
```