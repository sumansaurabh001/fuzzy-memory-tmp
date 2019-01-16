
import * as fs from 'fs';
import {db} from './init';




export function listDirectory(dir:string) {
  console.log('Listing the contents of directory ' + dir);
  fs.readdirSync(dir).forEach(file => {
    console.log('-> ' + file);
  });
}



export function promisifyCommand(command) {
  return new Promise((resolve, reject) => {
    command
      .on('end', () => {
        resolve();
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}





export async function getDocData(docPath) {

  const snap = await db.doc(docPath).get();

  return snap.data();
}
