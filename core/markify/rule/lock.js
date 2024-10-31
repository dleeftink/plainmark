export function lock(string, tag) {
  return `${tag}${string}${tag}`
}