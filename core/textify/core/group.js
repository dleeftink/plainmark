export function group(flat) {
   
  let perf = performance.now();
  let fuse = this.fuse ?? new Map();
      flat = flat ?? this.flat;
      fuse.clear();

  let text, path, data,list,node;
  const size = flat.length;
  for (var i = 0; i < size; i++) {
    
    [text, path] = Object.values(flat[i]);
    
    node = text.form ?? text;

    // retrieve form path
    if(node.path == undefined) {
      node.path = path
    } 
    
    data = fuse.get(text.wrap) ?? new Map(/*[[node,[text]]]*/);
    (list = data.get(node)) ? list.push({text,path}) : data.set(node,[{text,path}])
    //list = (data.get(node) ?? []); //[...(data.get(node) ?? [])].concat(text);
    //list.push({text,path})
    
    //data.set(node,list);

    // retrieve shortest wrap path
    // note: check for text.tagName or node.tagName ..?
    if (text.wrap.path == undefined) {
      text.wrap.path = path
    } else if(path.length < text.wrap.path.length && text.tagName !== 'BR' ) {
      text.wrap.path = path
    }
    fuse.set(text.wrap, data);
    
  }
  
  
  return { 
    time: performance.now() - perf,
    dict: this.fuse = fuse
  }
}