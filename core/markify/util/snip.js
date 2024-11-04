// utility function to snip method context from parent
// for instance to rejoin Class methods as functions
//
// see: Object.freeze

export function snip(array) {
  return Object.defineProperties(this,
    Object.fromEntries(
      array.map(name=> [
        name,{ 
          enumerable: false,
          writeable: false,
          value: new Function('return function '+ this[name].toString().replace(/^function\s/,'')).call()
        }
      ]
    ))
  )
}