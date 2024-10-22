import fs from 'node:fs'
//import assign from '../code/util/assign.js'
//import methods from '../code/proto.js'
//import Sweeper from '../code/index.js'
//import * as params from '../code/core/params.js'
import * as prettier from 'prettier'

// build script that inserts imports 

(async function () {

  /*let source = 'export default ' + assign(Sweeper,methods,params,true)
    .replace(/Object.assign\(this\.constructor\.prototype.*?\)/g,'') */

  let source = 'function test() { return "hello" }'

  let format =
    await prettier.format(source, { semi: true, printWidth: 60, parser: "babel" });
  await fs.writeFile('./dist/index.js', format, () => { })

})()
