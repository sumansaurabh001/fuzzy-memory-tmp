import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import { StripeFulfillmentwebhookController } from './controllers/stripe-fulfillmentwebhook.controller';
import { FirestoreService } from './services/firestore.service';
import {RawBodyMiddleware} from './controllers/raw-body.middleware';
import {JsonBodyMiddleware} from './controllers/json-body.middleware';
import {PurchaseCourseController} from './controllers/purchase-course.controller';
import {CorsMiddleware} from './controllers/cors.middleware';
import {AuthenticationMiddleware} from './controllers/authentication.middleware';

@Module({
  imports: [],
  controllers: [
    StripeFulfillmentwebhookController,
    PurchaseCourseController
  ],
  providers: [FirestoreService],
})
export class AppModule implements NestModule {

  public configure(consumer: MiddlewareConsumer): void {

    consumer.apply(CorsMiddleware).forRoutes('*');

    consumer.apply(AuthenticationMiddleware).forRoutes(PurchaseCourseController);

    consumer.apply(RawBodyMiddleware).forRoutes(StripeFulfillmentwebhookController);

    consumer.apply(JsonBodyMiddleware).forRoutes(PurchaseCourseController);
  }

}
