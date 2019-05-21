
import * as fs from 'fs';
import {db} from './init';
import * as firebase from 'firebase';
import * as dayjs from 'dayjs';




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


export function isFutureTimestamp(timestamp: firebase.firestore.Timestamp) {
  return dayjs(timestamp.toMillis()).isAfter(dayjs());
}


export async function getDocData(docPath) {

  const snap = await db.doc(docPath).get();

  return snap.data();
}


export function convertSnapsToData(snaps) {

  const data = [];

  snaps.forEach(snap => {
    data.push({...snap.data(), id: snap.id})
  })

  return data;

}
