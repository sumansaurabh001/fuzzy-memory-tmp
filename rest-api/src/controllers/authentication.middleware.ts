


import {Injectable, NestMiddleware} from '@nestjs/common';
import {Request, Response} from 'express';
import {FirestoreService} from '../services/firestore.service';

/**
 *
 * Ensures that the user is authenticated. If so, it retrieves the user profile from the Authentication JWT and stores it in the request,
 * otherwise throws an error.
 *
 */

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {

  constructor(private readonly firestore: FirestoreService) {}

  use(req: Request, res: Response, next: () => any) {

    if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
      !(req.cookies && req.cookies.__session)) {
      console.error('No JWT ID token was passed as a Bearer token in the Authorization header.',
        'Make sure you authorize your request by providing the following HTTP header:',
        'Authorization: Bearer <ID Token>',
        'or by passing a "__session" cookie.');
      res.status(403).send('Unauthorized');
      return;
    }

    let idToken;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      //console.log('Found "Authorization" header');
      // Read the ID Token from the Authorization header.
      idToken = req.headers.authorization.split('Bearer ')[1];
    } else if(req.cookies) {
      //console.log('Found "__session" cookie');
      // Read the ID Token from cookie.
      idToken = req.cookies.__session;
    } else {
      // No cookie
      res.status(403).send('Unauthorized');
      return;
    }
    this.firestore.auth.verifyIdToken(idToken).then((decodedIdToken) => {
      //console.log('ID Token correctly decoded', decodedIdToken);
      req["user"] = decodedIdToken;
      return next();
    }).catch((error) => {
      console.error('Error while verifying Firebase ID token:', error);
      res.status(403).send('Unauthorized');
    });

  }
}
