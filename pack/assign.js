function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

const isArrowFunction = fn => typeof fn === 'function' && !fn.prototype

// only inlines Class methods
// not nested functions inside methods

export default (Class, methods, params, raw = false) => {
  let source = Class.toString();

  for (let call in methods) {

    let flag = `\\s${escapeRegExp(call)}.*\\)\\s\\{[\\s\\S]+?\\}`;
    let head = new RegExp(flag, "m");

    // cheap function parsing;
    let body = methods[call].toString().replace(/^function .*?\(/, `${call}(`)

    // arrow functions need special handling because of (no) prototype
    if (isArrowFunction(methods[call]) && !body.startsWith("async")) {
      body = body.replace("(", call + " = (");
    }

    source = source.replace(head, body);
    
  }

  for (let name in params) {

    // only works for Stackblitz import file prefix

    // let rgx = new RegExp('[\\w_]+\\.(?=' + name + ')','g') // => negative match
    let rgx = new RegExp('[\\w_]+\\.(' + name + ')', 'g')
    source = source.replace(rgx,params[name])

  }

  return raw ? source : new Function("return " + source).call();

};