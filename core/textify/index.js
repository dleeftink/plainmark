import prototype from "./proto.js";

export default class Textifier {

  // drop: group filter | [d] >  s  >  k
  // skip: nodes filter |  d  > [s] >  k
  // keep: nodes filter |  d  >  s  > [k]
  // pick: field filter | [p] > [p] > [p]
  // step: steps upward | txt-->-?->--top

  constructor({ 

    drop = ["embedded", "metadata", "interactive","sectioning"], 
    keep = ["A","ARTICLE","SECTION"], 
    skip = ["SUP"],
    pick = ["href"] , 
    step = 8,
    hops = 2,
    same = 2
  
  } = {}) {
    
    Object.assign(this.constructor.prototype, prototype);
    
    const opts = arguments[0];
    this.opts = { ...opts };
    this.base = new Object();
    this.flat = new Array();
    this.fuse = new Map();
    this.reindex(); // populates base
  }

  textify(fragment) {

    let frag = fragment = this.recheck(fragment);

    let { dict:base,time:A } = this.reindex(null); // retrieves base 
    let { list:flat,time:B } = this.restore(frag);
    let { dict:fuse,time:C } = this.regroup(flat);

    this.time = {
      base:A,flat:B,fuse:C
    }

    // return this may be more intuitive
    return this

  }

  recheck() {

  }

  reindex() {
    
  }

  restore() {

  }

  regroup() {

  }

}