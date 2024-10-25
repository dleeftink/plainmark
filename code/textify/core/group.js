export function group(flat) {
   
  let perf = performance.now();
  let fuse = this.fuse ?? new Map();
  let last; fuse.clear();

  let text, path, data;
  const size = flat.length;
  for (var i = 0; i < size; i++) {
    [text, path] = Object.values(flat[i]);

    if (!text.parentElement) {
      if (!(text.tagName == "BR" && text.textContent.trim() == 0)) continue;
    }

    if (path[0].kind[0] == "phrasing") {
      data = [...(fuse.get(path[1]) ?? [])].concat(text);
      fuse.set(path[1], data);
      last = path[1];
    } else if (text.tagName == "BR") {
      data = [...(fuse.get(last) ?? [])].concat(text);
      fuse.set(last, data);
    } else {
      data = [...(fuse.get(path[0]) ?? [])].concat(text);
      fuse.set(path[0], data);
      last = path[0];
    }
  }
  return { 
    time: performance.now() - perf,
    dict: this.fuse = fuse
  }
}