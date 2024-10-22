export function trace(walk) {
  return walk
    .filter((d) => d.length)
    .map((inner) =>
      inner.reduce((pool, item) => {
        if (item.node && pool.has(item.node)) {
          pool.get(item.node).push(item);
        } else if (item.node) {
          pool.set(Object.assign(item.node, { line: item.text, type: item.type }), [item]);
        }
        return pool;
      }, new Map()),
    );
}