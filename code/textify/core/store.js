// traverse a DocumentFragment and clean-up attributes

export function store(fragment) {

  let dict = new Map() //this.dict.clear()
  let keep = this.keep

  let node, walker = document.createTreeWalker(fragment, NodeFilter.SHOW_ALL);

  while ((node = walker.nextNode())) {
    if (node.parentElement == undefined && node.nodeType == Node.ELEMENT_NODE) {
      node.dataset.branch = b++;
    }

    if (node.children?.length == 0 || node.length > 0) {
      let tgt = node.parentElement ?? node;
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
          nest++;
          leaf = leaf.parentNode;
        }
        tgt.dataset.depth = nest;
      }
    }
  }

  return dict
}