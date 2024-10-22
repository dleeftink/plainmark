import prototype from "./proto.js";

export default class Textifier {

  constructor({
    keep = ['href']
  } = {}) {

    this.size, this.branch;
    // this.dict = new Map();
    this.opts = { keep };

  }

  textify(fragment) {

    fragment = this.recheck(fragment);
    let dict = this.restore(fragment);

    let fuse = this.regroup(dict);
    let walk = this.rematch(fuse);
    let wrap = this.retrace(walk);
    
    let tags = this.realign(wrap);
    let post = this.reslice(tags);
    
    return {
      walk,wrap,post
    }

  }

  recheck() {

  }

  restore() {
    
  }

  regroup() {

  }

  rematch() {

  }

  retrace() {

  }

  realign() {

  }

  reslice() {

  }

}