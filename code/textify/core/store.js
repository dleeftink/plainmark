// traverse a DocumentFragment and clean-up attributes

export function store(fragment) {
  
  let root = document.body
  let main = document.createElement('main');
  let host = main.attachShadow({ mode: 'open' });

  let kind = this.kindsof;
  let code = this.recoder;

  let frag = fragment ?? getSelection().getRangeAt(0).cloneContents();  
  let body = document.createElement("body");
      body.appendChild(frag);

      host.appendChild(body);
      root.appendChild(main);
  
  // not necessary for now
  // let dict = new Map(); 

  let flat = new Array();
  let pick = ["href"];

  // node precedence k > s > d
    
  let keep = ["A","ARTICLE","SECTION"];
  let skip = ["SUP"];
  let drop = ["embedded", "metadata", "interactive","navigation"];
  
  let prev, text, last;
  let walk = document.createTreeWalker(host, NodeFilter.SHOW_TEXT);
  
  // process fragment textnodes
    
  let perfA = performance.now();
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
      its = node.kind = kind(tag);
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

    // logic can be simplified when constraining the search space to similar kinded nodes
    // cross check path [[0>1],[1>0]] whether successive above/below elements are deep equal
    // deletes and updates the selected elements if so
    if (prev && path[0] && prev[1] && path[0].textContent && prev[1].textContent && 
        path[0].textContent.trim().length > 0 && prev[1].textContent.trim().length > 0 &&
        path[0].textContent.trim().length < 32 && prev[1].textContent.trim().length < 32 &&
        path[0] == prev[1] && path[1] !== prev[0] && prev[0] !== undefined && 
        code(path[0].textContent) == code(prev[1].textContent)
     ) {
       if(path[0].kind.includes('phrasing') && prev[1].kind.includes('phrasing') && last.tagName != 'BR') {
       //console.log(its,"merged:", text.textContent, "with:", path[0].kind , path[0].outerHTML.slice(0,64));
       //dict.delete(last); text.textContent = stem.textContent;
        flat.pop(); text.textContent = stem.textContent;
       }
    }
    flat.push({text,path}); // [path] only for dev purposes -> [text] nodes contain path also;

    if (prev && path[1] && prev[0] && path[1].textContent && prev[0].textContent &&
        path[1].textContent.trim().length > 0 && prev[0].textContent.trim().length > 0 &&
        path[1].textContent.trim().length < 32 && prev[0].textContent.trim().length < 32 &&
        path[1] == prev[0] && path[0] !== prev[1] && path[1] !== undefined && 
        code(path[1].textContent) == code(prev[0].textContent)
     ) {
       if(path[1].kind.includes('phrasing') && prev[0].kind.includes('phrasing')  && last.tagName != 'BR') {
       //console.log(its,"merged:", text.textContent, "with:", path[1].kind , path[1].outerHTML.slice(0,64));
       //dict.delete(text);
       flat.pop()
       }
    }

    prev = path;
    last = text;
  }
 
  let perfB = performance.now();
  host.innerHTML = "";
  main.parentNode.removeChild(main);

  return {
    time:perfB-perfA,flat
  };
}