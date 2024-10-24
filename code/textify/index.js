import prototype from "./proto.js";

export default class Textifier {

  constructor({ 

    pick = [""] , // get attribute
    keep = [""] , // keep elements
    skip = [""] , // skip elements
    drop = [""] , // kind filterer 
  
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