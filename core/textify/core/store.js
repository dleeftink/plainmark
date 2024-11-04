// traverse a DocumentFragment and clean-up attributes

// how: TextIterator-like interface?
// how: Node.filter instead of loop?

export function store(fragment) {
  
  // get required methods
  let perf = performance.now();
  let kind = (tag) => this.base[tag] ?? new Set('');

  // set content container
  let root = document.body
  let main = document.createElement('main');
  let host = main.attachShadow({ mode: 'open' });

  // clone fragment instead of consuming
  let frag = fragment ?? getSelection().getRangeAt(0).cloneContents();  
  let body = document.createElement("body");
      body.appendChild(frag.cloneNode(true));

      host.appendChild(body);
      root.appendChild(main);  
      
  let list = this.flat ?? new Array();
      list.length = 0;
  let pick = this.opts.pick ?? ["href"];

  // node precedence k > s > d
  let keep = this.opts.keep ?? ["A","ARTICLE","SECTION"];
  let skip = this.opts.skip ?? ["SUP"];
  let drop = this.opts.drop ?? ["embedded", "metadata", "interactive","sectioning"];

  // max hops & same textContents
  let dist = this.opts.hops ?? 2;
  let same = this.opts.same ?? 2;
  
  // max steps && node filter
  let step = Math.max(0,this.opts.step ?? 8);
  let filt = (node,rank = 0,tier = step + 1) => {
    while(rank < tier && node.parentNode) {
      node = node.parentNode
      rank++
    }
    return rank < tier 
      ? NodeFilter.FILTER_ACCEPT 
      : NodeFilter.FILTER_REJECT
  }

  let prev, text, temp, past;
  let walk = document.createTreeWalker(host, NodeFilter.SHOW_TEXT,filt);
  
  // process fragment textnodes
    
  while ((text = walk.nextNode())) { 
    let stem = text.parentNode;

    // how to pass parentNode?                             
    if(((temp = text.textContent.replaceAll(' ','')), 
      temp.indexOf('\n') == 0 && temp.replaceAll('\n','').replaceAll('\t','').length == 0
    )) { 
      text = document.createElement('br');
      text.textContent = '\n'
    }
    if(text.tagName === 'BR' && past?.tagName === 'BR') continue
    let atts = [...(stem?.attributes || [])];

    let node = stem;
    let path = [];
    let safe = 0;
    let hops = 0;
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
      hop = node.skip = drop.some(kind=>its.has(kind)) || skip.includes(node.tagName)
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

    // safety to not thread the fragment beyond max steps
    let last = node; safe = 0;
 
    // find path or merge with existing
    while (node.parentNode && safe < step) {
      safe++;

      // add skip condition to non-visited nodes
      if (node.skip) {
        hops++;
        node = node?.parentNode;
        continue;
      } else {
        node.kind = kind(node.tagName);
        node.skip = drop.some(kind=>node.kind.has(kind)) || skip.includes(node.tagName)
        if(node.skip && !keep.includes(node.tagName)) {
          hops++;
          continue
        } else {
          // hops--; // should you decrease hops? -> probably not, because there's no prior increase
          delete node.skip;
        }
      } 
      
      // retrieve existing path
      // todo: rework this code
      /*if (node.parentNode.path) {
        path = path.concat(node.parentNode.path);
        continue;
      }*/

      // find nearest non-phrasing element ('wrapper') in path
      if(!text.wrap) {
        if(last && last.kind.has("phrasing") && !node.kind.has("phrasing")) {
          // if we encounter the first not-phrasing tag
          text.wrap = node;
        } else if(past && text.tagName == 'BR') {
          // if the current 'text' node is a 'break' element
          text.wrap = past.wrap
        } else if (path.length <= 1 && !node.kind.has("phrasing")) {
          // if we are at the first node in the selection
          // or the current path is shallow
          text.wrap = last
        } last = node;
      };
  
      // find latest phrasing element ('formatting') in path
      // updates each 'text' node with last phrasing element
      if(node.kind.has('phrasing')) {
        text.form = node;
      // explicitly set 'text' node to null when no phrasing elements in path
      } else if(path.length == 0) {
        text.form = null;
      }

      path.push(node);
      node = node.parentNode;
    }

    // not necessarily the safest way to drop content duplicates
    // safer would building the whole path -> then filter
    // but that would add some performance overhead
    if (hops < dist) { // && new Set([text,...path.filter(node=>node.kind.has('phrasing'))].map(node=>node.textContent)).size == 1
 
      let dupl = new Set().add(text.textContent);
      let span = path.length;
 
      for (let n = 0; n < span; n++) {
        let node = path[n]
        if(node.kind.has("phrasing")) dupl.add(node.textContent)
        if (dupl.size > same ) break;
      }

      if (dupl.size <= same ) {
        text.path = path;
        text.hops = hops;
        list.push({ text, path }); // [path] only for dev purposes -> [text] nodes contain path also;
      }

    }

    prev = path;
    past = text;

  }
 
  host.innerHTML = "";
  main.parentNode.removeChild(main);

  return {
    time: performance.now() - perf,
    list: this.flat = list
  };
}