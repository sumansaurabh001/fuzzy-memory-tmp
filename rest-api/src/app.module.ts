import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import { StripeFulfillmentwebhookController } from './controllers/stripe-fulfillmentwebhook.controller';
import { FirestoreService } from './services/firestore.service';
import {RawBodyMiddleware} from './controllers/raw-body.middleware';
import {JsonBodyMiddleware} from './controllers/json-body.middleware';
import {PurchaseCourseController} from './controllers/purchase-course.controller';
import {CorsMiddleware} from './controllers/cors.middleware';
import {AuthenticationMiddleware} from './controllers/authentication.middleware';
import {CustomJwtController} from './controllers/custom-jwt.controller';

@Module({
  imports: [],
  controllers: [
    StripeFulfillmentwebhookController,
    PurchaseCourseController,
    CustomJwtController
  ],
  providers: [FirestoreService],
})
export class AppModule implements NestModule {

  public configure(consumer: MiddlewareConsumer): void {

    consumer.apply(CorsMiddleware).forRoutes('*');

    consumer.apply(RawBodyMiddleware).forRoutes(StripeFulfillmentwebhookController);

    consumer.apply(AuthenticationMiddleware).forRoutes(
      PurchaseCourseController,
      CustomJwtController
    );

    consumer.apply(JsonBodyMiddleware).forRoutes(
      PurchaseCourseController,
      CustomJwtController
    );
  }

}
