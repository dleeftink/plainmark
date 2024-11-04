export function wrap(text = '',path = [],book = 'wrap') {

  let list = [], node;
  let span = path.length;
  
  let rule = this.rule; 
  let Rule = this.rule.prototype; Rule.book = book;

  // you can refer to below arrow functions 
  // since they are called during the pipe procedure
  let wrap = Rule[book] ?? (Rule[book] = new this.dict({
    para: (text,node,path) => text,
    list: (text,node,path) => nest(text,node,path),
    head: (text,node) => this.lead(text,parseInt(node.tagName.split('H')[1] ?? 0),'#'),
    cite: (text,node,path) => text
  }))

  let nest = (text,node,path) => { 
    let filt = path.filter(d=>d.tagName == 'UL' || d.tagName == 'OL')
    let self = filt[0]
    
    let sign = self.tagName == 'UL'
      ? '-' : (self.count ? self.count+=1 : (self.count = 1,self.count))+'.'

    return this.lead(text,
      filt.length-1,'    ',
      sign
    )
  }

  for(let i = 0; i < span; i++) {
    node = path[i];
    list.push(new rule(node,path))
  } // list.sort((a,b)=> a.rank - b.rank)

  // IF FILTERING,SORTING,OR ELSE, ADJUST span.length !

  // note: because you're dealing with flat block elements
  // you do not need to iterate over them ...

  let pass = text;
  for(let i = 0; i < span; i++) {
  
    let {node,pipe,path} = list[i]
    if(pipe == undefined) { 
      continue 
    } else {
      pass = pipe(pass,node,path) 
    }
  }
  
  return pass
  
}