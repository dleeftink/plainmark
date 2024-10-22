import fs from 'node:fs'
import assign from './assign.js'
import methods from '../code/textify/proto.js'
import Textifier from '../code/textify/index.js'
//import * as params from '../code/core/params.js'
import * as prettier from 'prettier'

// build script that inserts imports 


  let source = 'export default ' + assign(Textifier,methods,[],true)
    .replace(/Object.assign\(this\.constructor\.prototype.*?\)/g,'')
    .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm,'') // remove comments -> better to move after prettyfying
    .replace(/^(\s.* {\s{0,})$/mg,'$1\n').replace(/^(\s{2}[\}\);]{1,})$/gm,'\n$1') // extra white-space // https://stackoverflow.com/a/15123777/24561636
  let format =
    await prettier.format(source, { semi: true, printWidth: 60, parser: "babel" });
    await fs.writeFile('./dist/index.js', format.replace(/^(\s{2}\S+ {\s{0,})$/mg,'$1\n').replace(/^(\s{2}[\}\);]{1,})$/gm,'\n$1'), () => { })
  //console.log(source)
