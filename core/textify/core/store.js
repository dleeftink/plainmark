// traverse a DocumentFragment and clean-up attributes

// how: TextIterator-like interface?
// how: Node.filter instead of loop?

export function store(fragment) {
  
  // get required methods
  let perf = performance.now();
  let kind = (tag) => this.base[tag] ?? [];

  // set content container
  let root = document.body
  let main = document.createElement('main');
  let host = main.attachShadow({ mode: 'open' });

  let frag = fragment ?? getSelection().getRangeAt(0).cloneContents();  
  let body = document.createElement("body");
      body.appendChild(frag);

      host.appendChild(body);
      root.appendChild(main);  

  // v unnecessary for now
  // let dict = new Map();
  
  let list = this.flat ?? new Array();
      list.length = 0;
  let pick = this.opts.pick ?? ["href"];

  // node precedence k > s > d
    
  let keep = this.opts.keep ?? ["A","ARTICLE","SECTION"];
  let skip = this.opts.skip ?? ["SUP"];
  let drop = this.opts.drop ?? ["embedded", "metadata", "interactive","sectioning"];
  
  let prev, text, last;
  let walk = document.createTreeWalker(host, NodeFilter.SHOW_TEXT);
  
  // process fragment textnodes
    
  while ((text = walk.nextNode())) { 
    let stem = text.parentNode;

    // how to pass parentNode?                             
    if(/^\n+$/.test(text.textContent.replaceAll(' ',''))) text = document.createElement('br')
    if(text.tagName === 'BR' && last?.tagName === 'BR') continue
    let atts = [...(stem?.attributes || [])];

    let node = stem;
    let path = [];
    let safe = 0;
    let attr;

    let tag = stem.tagName;
    let its = node.kind;
    let hop = node.skip;

    // tag is a kind of?
    if(its == undefined) {
      its = node.kind = kind(tag ?? "Text");
    }
    
    // skip some kinds
    if(hop == undefined) {
      hop = node.skip = its.some((kind) => drop.includes(kind)) || skip.includes(node.tagName)
    }
    
    // wipe attributes except selection
    while ((attr = atts.pop()) !== undefined && safe < 32) { 
      if (pick.includes(attr.name)) continue; 
      stem.removeAttribute(attr.name);
      safe++
    }

    // skip certain kind of nodes, keep some
    if (hop && !keep.includes(node.tagName)) {
      continue
    } else {
      delete node.skip;
    }

    //dict.set(text, path); 
    safe = 0;
 
    // find path or merge with existing
    while (node.parentNode && safe < 8) {
      safe++;

      // add skip condition to non-visited nodes
      if (node.skip) {
        node = node?.parentNode;
        continue;
      } else {
        node.kind = kind(node.tagName);
        node.skip = node.kind.some((kind) => drop.includes(kind)) || skip.includes(node.tagName)
        if(node.skip && !keep.includes(node.tagName)) {
          continue
        } else {
          delete node.skip;
        }
      } 
      
      // retrieve existing path
      if (node.parentNode.path) {
        path = path.concat(node.parentNode.path);
        continue;
      }
      path.push(node);
      node = node.parentNode;
    }

    text.path = path;
    list.push({ text, path }); // [path] only for dev purposes -> [text] nodes contain path also;

    // general merges pattern
    // todo: content equality

    let a = 0,anode,bnode,b = 0;
    if ((anode = path.find((d, i) => ((a = i), d.tagName == "A"))) == (bnode = prev?.find((d, j) => ((b = j), d.tagName == "A")))) {
      if (bnode !== undefined && Math.abs(a-b) < 2) {
        if (b > a) { 

          // pre-merge strategy
          list.pop(); list.pop(); 
          list.push({text,path}); text.textContent = stem.textContent

        } else if (a > b) {

          list.pop(); 
          // post-merge strategy
          // list.push({ text, path });
          // text.textContent = last.parentNode.textContent;

        }
      }
    }

    prev = path;
    last = text;

  }
 
  host.innerHTML = "";
  main.parentNode.removeChild(main);

  return {
    time: performance.now() - perf,
    list: this.flat = list
  };
}