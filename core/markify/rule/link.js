export function link(string,href) {
  
  /*let left = string.match(/^([\[\{\(]+)/)?.[0] ?? '';
  let right =  string.match(/([\]\}\)]+$)/)?.[0] ??'';

  return `${left}[${string.replace(/[\(\)\[\]\{\}]/g, "")}](${href})${right}`;*/

  return `[${string}](${href})`;
}