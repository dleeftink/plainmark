// utility function to snip method context from parent
// e.g. to rejoin Class methods as functions

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