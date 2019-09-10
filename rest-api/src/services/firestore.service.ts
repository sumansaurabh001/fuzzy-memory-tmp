import { Injectable } from '@nestjs/common';





const Firestore = require('@google-cloud/firestore');

const db = new Firestore();


@Injectable()
export class FirestoreService {
  get db() {
    return db;
  }

  async getDocData(docPath) {

    const snap = await this.db.doc(docPath).get();

    return snap.data();
  }

}

