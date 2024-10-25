export function lead(string,depth,symbol = '-',tabs) {
  tabs = tabs ?? '  ';
  return `${tabs.repeat(depth)}${symbol ?? (depth + '.')} ${string}`
}