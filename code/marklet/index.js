import prototype from "./proto";

export default class Sweeper {

  #prevSelections = null;
  #activeListener = null;
  #activeHandlers = [];

  constructor({
  } = {}) {
    
    Object.assign(this.constructor.prototype, prototype);

  }

  init() {
  // placeholder
  }

  reset() {
  // placeholder
  }

  debounce() {
  // placeholder  
  }

  textify() {
  // placeholder  
  }

  markify() {
  // placeholder  
  }

  process() {
  // user template  
  }

}