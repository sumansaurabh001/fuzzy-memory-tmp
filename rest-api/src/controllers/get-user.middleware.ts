import {Injectable, NestMiddleware} from '@nestjs/common';
import {Request, Response} from 'express';
import {FirestoreService} from '../services/firestore.service';



@Injectable()
export class GetUserMiddleware implements NestMiddleware {

  constructor(private readonly firestore: FirestoreService) {

  }

  use(req: Request, res: Response, next: () => any) {

    let idToken;

    // Read the ID Token from the Authorization header.
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      idToken = req.headers.authorization.split('Bearer ')[1];
    }
    else if (req.query.idToken) {
      idToken = req.query.idToken;
    }

    if (idToken) {
      this.firestore.auth.verifyIdToken(idToken).then((decodedIdToken) => {
        req["user"] = decodedIdToken;
        return next();
      }).catch((error) => {
        console.error('Error while verifying Firebase ID token:', error);
        res.status(403).send('Unauthorized');
      });
    }
    else {
      return next();
    }

  }
}
