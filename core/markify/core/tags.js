export function form(text,path) {

  let list = [], node;
  let span = path.length;

  let form = this.form ?? (this.form = new this.dict({
    code: (text,node) => this.wrap(text, '`'),
    link: (text,node) => this.link(text, node.href),
    bold: (text,node) => this.wrap(text, '**'),
    emph: (text,node) => this.wrap(text, '*'),
    head: (text,node) => this.lead(text,parseInt(node.tagName.match(/\d+/)[0] ?? 0),'#'),
    none: (text,node) => text
  }))

  for(let i = 0; i < span; i++) {
    node = path[i];
    list.push(new rule(node))
  } list.sort((a,b)=> a.rank - b.rank)

  let prep,item, exit = text.textContent;
   for(let i = 0; i < span; i++) {
    item = list[i]
    prep = item.pipe;
    node = item.node;
    exit = prep(exit,node) 
  }
  
  return list

  function rule(node) {
    return Object.assign({node},form[node.tagName.split(/[1-6]/)[0]])
  }
  
}