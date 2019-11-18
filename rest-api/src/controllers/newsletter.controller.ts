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
        email = request.body.email,
        testUser = request.body.testUser,
        userId = request.user.uid;

      const newsletterPath = `schools/${tenantId}/newsletter`;

      const snap = await this.firestore.db.collection(newsletterPath, ref => ref.where('email', '==', email)).get();

      if (!snap.empty) {
        console.log('Email already added to newsletter, exiting.');
        return;
      }

      if (!testUser) {

        const settings = await this.firestore.getDocData(`tenantSettings/${tenantId}`);

        if (settings.mailerlite) {
          await this.addToMailerliteNewsletter(settings.mailerlite, email);
        }

        // add user email to newsletter
        const batch = this.firestore.db.batch();

        const newsletterRef = this.firestore.db.collection(newsletterPath).doc();

        batch.set(newsletterRef, {email: email});

        const userRef = this.firestore.db.doc(`schools/${tenantId}/users/${userId}`);

        batch.update(userRef, 'addedToNewsletter', true);

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
