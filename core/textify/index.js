import prototype from "./proto.js";

export default class Textifier {

  // drop: group filter | [d] >  s  >  k
  // skip: nodes filter |  d  > [s] >  k
  // keep: nodes filter |  d  >  s  > [k]
  // pick: field filter |  .  >  .  >  .


  constructor({ 

    drop = ["embedded", "metadata", "interactive","sectioning"], 
    keep = ["A","ARTICLE","SECTION"], 
    skip = ["SUP"],
    pick = ["href"] , 
  
  } = {}) {
    
    Object.assign(this.constructor.prototype, prototype);
    
    // this.kind = this.kindsof.bind(this) 
    
    const opts = arguments[0];
     this.opts = { ...opts };

     this.base = new Object();
     this.flat = new Array();
     this.fuse = new Map();
    
  }

  textify(fragment) {

    let frag = fragment = this.recheck(fragment);

    let { dict:base,time:A } = this.reindex();
    let { list:flat,time:B } = this.restore(frag);
    let { dict:fuse,time:C } = this.regroup(flat);

    return {
      base,flat,fuse,
      time:{
        base:A,flat:B,fuse:C
      }
    }

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