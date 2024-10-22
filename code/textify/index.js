import prototype from "./proto.js";

export default class Textifier {

  constructor({ 

    keep = ["href"] , // keep attributes
    drop = ["noscript"] // drop tags (TODO)
  
  } = {}) {
    
    this.opts = { keep, drop };
    Object.assign(this.constructor.prototype, prototype);
    
    // this.dict = new Map();

  }

  textify(fragment) {

    fragment = this.recheck(fragment);

    let dict = this.restore(fragment);
    let fuse = this.regroup(dict);

    let walk = this.rematch(fuse);
    let wrap = this.retrace(walk);

    let tags = this.realign(wrap);
    let post = this.reslice(tags);

    post.flat().forEach((item, i, f) => {
      let prev = f[i - 1];
      let next = f[i + 1];
      if (prev) Object.assign(item, { prev }, { seq: i });
      if (next) Object.assign(item, { next }, { seq: i });
    });

    return {
      walk, wrap, post
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