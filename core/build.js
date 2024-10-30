import fs from 'node:fs'
import assign from './compile/assign.js'
import * as prettier from 'prettier'

let target = process.argv[2] ?? null;

// build script that inserts imports 
async function build(target = '', params = false) {

  let parameters = params ? (await import(`./${target}/params.js`)).default : []
  let methods = (await import(`./${target}/proto.js`)).default;
  let Class = (await import(`./${target}/index.js`)).default;
  
  let source = 'export default ' + assign(Class, methods, parameters, true)
    .replace(/Object.assign\(this\.constructor\.prototype.*?\)/g, '')
    .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '') // remove comments -> better to move after prettyfying
    //.replace(/^(\s.* {\s{0,})$/mg, '$1\n').replace(/^(\s{2}[\}\);]{1,})$/gm, '\n$1') // extra white-space // https://stackoverflow.com/a/15123777/24561636
    
    let format = await prettier.format(source, { semi: true, printWidth: 60, parser: "babel" });
    format = format.replace(/^(\s{2}\S+ {\s{0,})$/mg, '$1\n').replace(/^(\s{2}[\}\);]{1,})$/gm, '\n$1');
    
    // replace long JSON EOF marks

    // strategy 1 (requires pre-escaping):
    // format = format.replace(/___/g,'", "') 

    // strategy 2 (post):
    format = format.replace(/\s+("[^"]+?")\,\n/gm,'$1, ').replace(/\,\s+\]/g,']')
    
    // remove last trailing newline from constructor once
    format = format.replace(/\;$\n$(\n\s+\})/m,';$1') 
  
  await fs.writeFile(`./pack/${target}.js`, format, () => { })

}

if(target) {
  console.log(`Building ${target}.js...`)
  await build(target);
  console.log(`Build completed at: pack/${target}.js`)
} else {
  console.log('Provide target module name')
}