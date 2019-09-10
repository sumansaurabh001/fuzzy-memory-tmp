import {Controller, Post, Req, Res} from '@nestjs/common';
import {FirestoreService} from '../services/firestore.service';


/**
 *
 * docs - https://firebase.google.com/docs/auth/admin/create-custom-tokens
 *
 *
 */


@Controller()
export class CustomJwtController {

  constructor(private readonly firestore: FirestoreService) {

  }

  @Post('/api/custom-jwt')
  async apiPurchaseCourse(@Req() request, @Res() response): Promise<any> {

    try {

      const userUid = request.body.uid,
            tenantId = request.body.tenantId,
            requesterUid = request.user.uid;

      console.log('Creating JWT for uid:' + userUid);

      if (userUid != requesterUid) {
        throw 'Currently, a user (logged in via Firebase Authentication) can only create authentication JWT tokens for himself, in order to be able to login to tenant websites. ' +
        'In the future it will be possible for admin users to create JWTs for other users as well, so that they can login as another user (for support requests).';
      }

      // get the user roles from the database and add them to the token
      const snap = await this.firestore.db.doc(`tenantSettings/${tenantId}/userPermissions/${requesterUid}`).get();

      const userPermissions = snap.data();

      console.log("Got the user permissions from the database: ", userPermissions);

      const additionalClaims = {
        tenantId,
        isAdmin: userPermissions && userPermissions.isAdmin
      };

      console.log("additionalClaims", additionalClaims);

      const customJWt = await this.firestore.auth.createCustomToken(userUid, additionalClaims);

      console.log("Created custom JWT:", customJWt);

      response.status(200).json({customJWt});

    }
    catch(error) {
      console.log("Unexpected error occurred creating custom JWT: ", error);
      response.status(500).json({error});
    }

  }

}
