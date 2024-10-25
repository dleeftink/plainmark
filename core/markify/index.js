import prototype from "./proto.js";

export default class Markifier {
  
  constructor({

  } = {}) {

    Object.assign(this.constructor.prototype, prototype);
    this.data
  
  }

  process(init) {

    let pipe = this.parseTags(init);
        pipe = this.parseLine(pipe);

    return pipe
  }

  parseTags() {

  }

  parseLine() {

  }

  link() {
    
  }

  lead() {
    
  }

  wrap() {
    
  }

} 