import fs from 'node:fs'
import assign from './compile/assign.js'
import methods from './textify/proto.js'
import Textifier from './textify/index.js'
//import * as params from '../core/params.js'
import * as prettier from 'prettier'

// build script that inserts imports 

let source = 'export default ' + assign(Textifier, methods, [], true)
  .replace(/Object.assign\(this\.constructor\.prototype.*?\)/g, '')
  .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '') // remove comments -> better to move after prettyfying
  .replace(/^(\s.* {\s{0,})$/mg, '$1\n').replace(/^(\s{2}[\}\);]{1,})$/gm, '\n$1') // extra white-space // https://stackoverflow.com/a/15123777/24561636

let format = await prettier.format(source, { semi: true, printWidth: 60, parser: "babel" });
    format = format.replace(/^(\s{2}\S+ {\s{0,})$/mg, '$1\n').replace(/^(\s{2}[\}\);]{1,})$/gm, '\n$1');
    
    // replace long JSON EOF marks
    // strategy 1 (pre):
    // format = format.replace(/___/g,'", "') 
    // strategy 2 (post):
    format = format.replace(/\s+("[^"]+?")\,\n/gm,'$1, ').replace(/\,\s+\]/g,']'); 

await fs.writeFile('./pack/textify.js', format, () => { })

//console.log(source)