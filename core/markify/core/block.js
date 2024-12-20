export function wrap(text,path,mode = 'wrap') {

  let list = [], node;
  let span = path.length;
  
  let rule = this.rule; 
  let Rule = this.rule.prototype; 

  let nest = (text,node,path) => { 
    let filt = path.filter(d=>d.tagName == 'UL' || d.tagName == 'OL')
    let self = filt[0]
    console.log(self)
    let sign = self.tagName == 'UL'
      ? '-' : (self.count ? self.count+=1 : (self.count = 1,self.count))+'.'

    return this.lead(text,
      filt.length-1,'    ',
      sign
    )
  }
  
  let wrap = Rule[mode] ?? (Rule.mode = mode, Rule[mode] = new this.dict({
    para: (text,node,path) => text,
    list: (text,node,path) => nest(text,node,path),
    cite: (text,node,path) => text
  }))

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