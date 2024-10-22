// traverse a DocumentFragment and clean-up attributes

export function store(fragment) {

  let dict = new Map() //this.dict.clear()
  let keep = this.opts.keep;
  
  let branch;
  let node, walker = document.createTreeWalker(fragment, NodeFilter.SHOW_ALL);

  let drop = this.opts.drop.map(d=>d.toUpperCase());

  while ((node = walker.nextNode())) {
    if (node.parentElement == undefined && node.nodeType == Node.ELEMENT_NODE) {
      node.dataset.branch = branch++;
    }

    if (node.children?.length == 0 || node.length > 0) {
      let tgt = node.parentElement ?? node;
      if (drop.includes(node.tagName) || drop.includes(node.parentElement?.tagName)) continue // first pass delete ...does not check for non-tags

      dict.set(node, tgt);

      let attributes = [...(tgt?.attributes || [])];
      let attr;

      while ((attr = attributes.pop()) !== undefined) {
        if (keep.includes(attr.name)) continue;
        tgt.removeAttribute(attr.name);
      }

      if (tgt.nodeType == Node.ELEMENT_NODE && tgt.dataset.depth == undefined) {
        let leaf = tgt;
        let nest = -1;
        while (leaf && leaf.parentNode) {
          nest++; if(drop.includes(leaf.tagName) || drop.includes(leaf.parentNode?.tagName)) dict.delete(node) // second pass delete ...
          leaf = leaf.parentNode;
        }
        tgt.dataset.depth = nest;
      }
    }
  }

  return dict
}