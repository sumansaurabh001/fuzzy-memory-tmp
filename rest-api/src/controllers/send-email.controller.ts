import {Controller, Post, Req, Res} from '@nestjs/common';
import {FirestoreService} from '../services/firestore.service';
import {Email, sendEmail} from '../utils/send-email';



@Controller()
export class SendEmailController {

  constructor(private readonly firestore: FirestoreService) {}


  @Post("/api/send-email")
  async apiSendEmail(@Req() req, @Res() res): Promise<any> {

    try {

      const userId = req.user.uid,
        tenantId = req.body.tenantId,
        email = req.body.email;

      const tenantPath = `tenants/${tenantId}`,
        tenant = await this.firestore.getDocData(tenantPath);

      const emailMessage: Email = {
        ...email,
        to: tenant.supportEmail
      };

      console.log("Sending email: ", JSON.stringify(emailMessage));

      // send email with customer message to the tenant support mailbox
      await sendEmail(emailMessage);

      res.status(200).json({message: 'Email sent successfully.'});

    }
    catch (error) {
      console.log('Unexpected error occurred while sending contact email: ', error);
      res.status(500).json({error});
    }

  }


}
