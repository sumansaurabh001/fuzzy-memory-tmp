import { Injectable } from '@nestjs/common';


import * as admin from 'firebase-admin';

admin.initializeApp();

export const db = admin.firestore();


@Injectable()
export class FirestoreService {
  get db() {
    return db;
  }
}

