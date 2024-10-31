export function dict(rules) {
    
  Object.assign(this,{rule:{...rules}})

  let tags = {
    B: { pipe: this.rule.bold, rank: 2 },
    I: { pipe: this.rule.emph, rank: 1 },
    A: { pipe: this.rule.link, rank: 3 },
    H: { pipe: this.rule.head, rank: 4 },
  
    // to do: codeblocks
    CODE: { pipe: this.rule.code, rank: 1 },
    NONE: { pipe: this.rule.none, rank: 5 },
  
    P: { pipe: this.rule.para, rank: 6},
    // is LI a no-op?
    // LI: { pipe: this.rule.list, rank: 6},
    OL: { pipe: this.rule.list, rank: 6},
    UL: { pipe: this.rule.list, rank: 6},
    DIV: { pipe: this.rule.para, rank: 6},
    BLOCKQUOTE: { pipe: this.rule.cite, rank: 6},    
  };

  for (let tag in tags) {
    if(tags[tag].pipe == undefined) delete tags[tag]
  }
    
  return tags
}
