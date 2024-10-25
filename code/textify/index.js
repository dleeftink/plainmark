import prototype from "./proto.js";

export default class Textifier {

  constructor({ 

    // group filter
    drop = ["embedded", "metadata", "interactive","sectioning"], 

    // element filter k > s > d
    keep = ["A","ARTICLE","SECTION"], 
    skip = ["SUP"],

    // field filter
    pick = ["href"] , 
  
  } = {}) {
    
    this.opts = { pick,skip,keep, drop };
    Object.assign(this.constructor.prototype, prototype);

  }

  textify(fragment) {

    fragment = this.recheck(fragment);

    let dict = this.restore(fragment);
    let fuse = this.regroup(dict.flat);

    return {
      dict, fuse
    }

  }

  recheck() {

  }

  restore() {

  }

  regroup() {

  }

  recoder() {

  }

  kindsof() {

  }

}