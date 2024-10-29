export function group(flat) {
   
  let perf = performance.now();
  let fuse = this.fuse ?? new Map();
  let last; fuse.clear();

  let text, path, data,list,node;
  const size = flat.length;
  for (var i = 0; i < size; i++) {
    
    [text, path] = Object.values(flat[i]);
    
    node = text.form ?? text;
    
    data = fuse.get(text.wrap) ?? new Map(/*[[node,[text]]]*/);
    (list = data.get(node)) ? list.push({text,path}) : data.set(node,[{text,path}])
    //list = (data.get(node) ?? []); //[...(data.get(node) ?? [])].concat(text);
    //list.push({text,path})
    
    //data.set(node,list);
    fuse.set(text.wrap, data);
    
  }
  
  
  return { 
    time: performance.now() - perf,
    dict: this.fuse = fuse
  }
}