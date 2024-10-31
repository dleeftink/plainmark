export function lead(string,depth,tabs = '  ',symbol = '') {
  return `${tabs.repeat(depth)}${symbol ?? (depth + '.')} ${string}`
}