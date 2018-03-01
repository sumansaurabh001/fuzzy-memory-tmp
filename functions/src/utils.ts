import * as functions from 'firebase-functions';

const admin = require('firebase-admin');

export function initDB() {
  admin.initializeApp(functions.config().firebase);
  return admin.firestore();
}


