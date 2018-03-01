import * as functions from 'firebase-functions';


export function initDB() {
  const admin = require('firebase-admin');
  admin.initializeApp(functions.config().firebase);
  return admin.firestore();
}


