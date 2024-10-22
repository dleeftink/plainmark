export function group(dict) {

  // prepare nodes for parent/child containment checks
  let prep = Array.from(dict)
    .map(([node, prev]) => ({
      text: node.textContent,
      node,
      group: (prev.tagName ? prev : undefined) ?? (node.tagName ? node : undefined) ?? document.createElement("text"), // not really Text nodes,
      type: (node.tagName ? node : undefined) ?? (prev.tagName ? prev : undefined) ?? document.createElement("text"), // not really Text nodes,
    }))
    .filter((d, i, f) => d.text != f[i - 1]?.text);

  // merge consecutive nodes in the same parent group
  let fuse = prep.reduce(
    (pool, item) => (
      (size = pool.length) && item.group == pool[size - 1][0].group ? pool[size - 1].push(item) : (pool[size] = [item]), pool
    ),
    [],
  );

  return fuse
}