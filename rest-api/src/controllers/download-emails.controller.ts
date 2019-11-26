

import {Controller, Get, Req, Res} from '@nestjs/common';
import {FirestoreService} from '../services/firestore.service';


@Controller()
export class DownloadEmailsController {

  constructor(private readonly firestore: FirestoreService) {

  }


  @Get("/api/download-all-emails")
  async downloadAllEmails(@Req() request, @Res() response) {

    try {

      if (!request.user || !request.user.isAdmin) {
        const message = "Only administrators can download user emails, denying access.";
        console.log(message);
        response.status(403).send();
        return;
      }

      const tenantId = request.user.tenantId;

      const userSnaps = await this.firestore.db.collection(`schools/${tenantId}/users`).get();

      const userEmails = userSnaps.docs.map(snap => snap.data().email);

      const collectedEmailsSnaps = await this.firestore.db.collection(`schools/${tenantId}/newsletter`).get();

      const collectedEmails = collectedEmailsSnaps.docs.map(snap => snap.data().email);

      const uniqueEmails: any = {};

      userEmails.forEach(email => uniqueEmails[email] = true);

      collectedEmails.forEach(email => uniqueEmails[email] = true);

      const emailsFileContent = Object.keys(uniqueEmails).join("\n");

      response
        .status(200)
        .set('Content-Disposition','attachment; filename=all-customer-emails.txt')
        .send(emailsFileContent);



    } catch (error) {
      const message = 'Unexpected error preparing list of available emails:';
      console.log(message, error);
      response.status(500).json({error: message});
    }
  }

}
