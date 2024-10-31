export function form(text,path,mode = 'form') {

  let list = [], node;
  let span = path.length;
  
  let rule = this.rule; 
  let Rule = this.rule.prototype; 
  
  let form = Rule[mode] ?? (Rule.mode = mode, Rule[mode] = new this.dict({
    code: (text,node) => this.lock(text, '`'),
    link: (text,node) => this.link(text, node.href),
    bold: (text,node) => this.lock(text, '**'),
    emph: (text,node) => this.lock(text, '*'),
    head: (text,node) => this.lead(text,parseInt(node.tagName.split('H')[1] ?? 0),'#'),
    none: (text,node) => text
  }))

  for(let i = 0; i < span; i++) {
    node = path[i];
    list.push(new rule(node))
  } list = list.sort((a,b)=> a.rank - b.rank)
 
  let pass = text.textContent;
  for(let i = 0; i < span; i++) {
    let {node,pipe} = list[i]
    if(pipe == undefined) { 
      continue 
    } else {
      pass = pipe(pass,node) 
    }
  }
  
  return pass
  
}