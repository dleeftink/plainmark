import path from 'node:path';
import { promises as fs } from 'node:fs';

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

async function readFile(relativePath,from = import.meta.filename) {
  
  //const filePath = path.join(__dirname,  ...fileString.split('/'));
  
  const __dirname = dirname(fileURLToPath(from));
  const filePath = path.resolve(__dirname, relativePath);

  return fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      reject(err);
    } else {
      resolve(data);
    }
  })
}

async function openDoc(relativePath, from) {

  document.open();
  document.write(await readFile(relativePath, from));
  document.close();
}

export {
  readFile, openDoc
}
