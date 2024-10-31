export function dict(rules,deps) {
    
  Object.assign(this,{rule:{...rules}})
  
return {
    B: { pipe: this.rule.bold, rank: 2 },
    I: { pipe: this.rule.emph, rank: 1 },
    A: { pipe: this.rule.link, rank: 3 },
    H: { pipe: this.rule.head, rank: 4 },

    CODE: { pipe: this.rule.code, rank: 1 },
    NONE: { pipe: this.rule.none, rank: 5 },
  };
}
