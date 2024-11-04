export function rule(node,path = []) {
  return Object.assign({node,path},this[this.book][node.tagName.split(/[1-6]/)[0]])
}