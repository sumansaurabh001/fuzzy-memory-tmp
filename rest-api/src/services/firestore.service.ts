import { Injectable } from '@nestjs/common';


const admin = require('firebase-admin');

admin.initializeApp();




const Firestore = require('@google-cloud/firestore');

const db = new Firestore();

export const auth = admin.auth();


@Injectable()
export class FirestoreService {
  get db() {
    return db;
  }

  get auth() {
    return auth;
  }

  async getDocData(docPath) {

    const snap = await this.db.doc(docPath).get();

    return snap.data();
  }

}

