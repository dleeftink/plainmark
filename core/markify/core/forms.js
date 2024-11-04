export function form(text = '', path = [], book = 'form') {

  let list = [], node;
  let span = path.length;
  
  let rule = this.rule; 
  let Rule = this.rule.prototype; Rule.book = book;
  
  let form = Rule[book] ?? (Rule[book] = new this.dict({
    code: (text,node) => this.lock(text, '`'),
    link: (text,node) => this.link(text, node.href),
    head: (text,node) => this.lead(text,parseInt(node.tagName.split('H')[1] ?? 0),'#'),
    bold: (text,node) => this.lock(text, '**'),
    emph: (text,node) => this.lock(text, '*'),
    none: (text,node) => text
  }))

  for(let i = 0; i < span; i++) {
    node = path[i];
    list.push(new rule(node))
  } list = list.sort((a,b)=> a.rank - b.rank)
 
  let pass = text?.textContent ?? text;
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