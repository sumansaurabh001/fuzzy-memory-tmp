
import * as functions from 'firebase-functions';


const admin = require('firebase-admin');

admin.initializeApp();



export const db = admin.firestore();

db.settings({timestampsInSnapshots: true});

export const storage = admin.storage();

export const auth = admin.auth();

