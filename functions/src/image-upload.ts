
import * as functions from 'firebase-functions';
import {initDB} from './utils';



const gcs = require('@google-cloud/storage')();

import * as os from 'os';
import * as path from 'path';


const db = initDB();


export const imageUpload = functions.storage.object().onChange(event => {

  console.log(event);
  return;

});


