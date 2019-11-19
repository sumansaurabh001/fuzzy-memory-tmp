import {Controller, Post, Req, Res} from '@nestjs/common';
import {FirestoreService} from '../services/firestore.service';
import * as rp from 'request-promise';


@Controller()
export class NewsletterController {

  constructor(private readonly firestore: FirestoreService) {

  }

  @Post('/api/add-to-newsletter')
  async addUserToNewsletter(@Req() request, @Res() response): Promise<any> {

    try {

      const tenantId = request.body.tenantId,
        testUser = request.body.testUser,
        userId = request.user ? request.user.uid : undefined;

      let email = request.body.email;

      if (!email) {
        console.log('Email not provided, exiting.');
        response.status(500).json({error: "Email not provided"});
        return;
      }

      email = email.toLowerCase();

      const newsletterPath = `schools/${tenantId}/newsletter`;

      const results = await this.firestore.db.collection(newsletterPath).where('email', '==', email).get();

      if (!testUser) {

        const settings = await this.firestore.getDocData(`tenantSettings/${tenantId}`);

        if (settings.mailerlite) {
          await this.addToMailerliteNewsletter(settings.mailerlite, email);
        }

        // add user email to newsletter
        const batch = this.firestore.db.batch();

        if (results.empty) {

          const newsletterRef = this.firestore.db.collection(newsletterPath).doc();

          batch.set(newsletterRef, {email: email});

        }

        if (userId) {
          const userRef = this.firestore.db.doc(`schools/${tenantId}/users/${userId}`);

          batch.update(userRef, 'addedToNewsletter', true);

        }

        await batch.commit();

      }

      response.status(200).json();

    } catch (error) {
      console.log('Unexpected error occurred while adding user to newsletter: ', error);
      response.status(500).json({error});
    }

  }

  private addToMailerliteNewsletter(settings: any, email: string) {
    return rp({
      method: 'POST',
      headers: {
        'X-MailerLite-ApiKey': settings.apiKey,
        'Content-Type': 'application/json'
      },
      uri: `https://api.mailerlite.com/api/v2/groups/${settings.groupId}/subscribers`,
      body: JSON.stringify({
        email,
        resubscribe: true,
        autoresponders: true
      })
    });

  }


}
