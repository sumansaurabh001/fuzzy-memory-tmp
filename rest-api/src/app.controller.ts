import { Controller, Get } from '@nestjs/common';
import { FirestoreService } from './firestore.service';

@Controller()
export class AppController {

  constructor(private readonly firestore: FirestoreService) {}

  @Get()
  async getHello(): Promise<any> {

    const course = await this.firestore.db.doc("/schools/VzvFqXT7hHQZAneGvhYu94GafwU2/courses/ESeLEZmnF36VQYr5QwlE").get();

    return course.data();

  }
}
