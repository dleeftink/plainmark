import prototype from "./proto.js";

export default class Markifier {
  
  constructor({

  } = {}) {

    Object.assign(this.constructor.prototype, prototype);
    this.snip(['dict','rule']);

    this.reform();
    this.rewrap();
    // this.base = { form: null, wrap: null }
  
  }

  process(init) {

    //let pipe = this.parseTags(init);
    //    pipe = this.parseLine(pipe);

    return pipe
  }

  reform() {

  }

  rewrap() {

  }

  link() {
    
  }

  lead() {
    
  }

  lock() {
    
  }

  dict() {
    
  }

  rule() {
    
  }

  snip() {

  }

} 