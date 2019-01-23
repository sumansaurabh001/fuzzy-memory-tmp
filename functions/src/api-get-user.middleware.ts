import {db, auth} from './init';

/*
*
* Middleware that retrieves user information from the JWT attached to the request.
*
*
**/

export function getUserMiddleware(req, res, next) {
  console.log('Extracting user data from JWT');

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {

    console.log('Found "Authorization" header');

    // Read the ID Token from the Authorization header.
    let idToken = req.headers.authorization.split('Bearer ')[1];

    auth.verifyIdToken(idToken).then((decodedIdToken) => {
      console.log('ID Token correctly decoded', decodedIdToken);
      req.user = decodedIdToken;
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
