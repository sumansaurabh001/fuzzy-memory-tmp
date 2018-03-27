
import * as fs from 'fs';




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
