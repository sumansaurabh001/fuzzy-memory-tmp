import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import { StripeFulfillmentwebhookController } from './controllers/stripe-fulfillmentwebhook.controller';
import { FirestoreService } from './services/firestore.service';
import {RawBodyMiddleware} from './controllers/raw-body.middleware';
import {JsonBodyMiddleware} from './controllers/json-body.middleware';
import {PurchaseCourseController} from './controllers/purchase-course.controller';
import {CorsMiddleware} from './controllers/cors.middleware';
import {AuthenticationMiddleware} from './controllers/authentication.middleware';
import {CustomJwtController} from './controllers/custom-jwt.controller';
import {ActivatePlanController} from './controllers/activate-plan.controller';
import {CancelPlanController} from './controllers/cancel-plan.controller';
import {VideoAccessController} from './controllers/video-access.controller';
import {GetUserMiddleware} from './controllers/get-user.middleware';

@Module({
  imports: [],
  controllers: [
    StripeFulfillmentwebhookController,
    PurchaseCourseController,
    CustomJwtController,
    ActivatePlanController,
    CancelPlanController,
    VideoAccessController
  ],
  providers: [FirestoreService],
})
export class AppModule implements NestModule {

  public configure(consumer: MiddlewareConsumer): void {

    consumer.apply(CorsMiddleware).forRoutes('*');

    consumer.apply(RawBodyMiddleware).forRoutes(StripeFulfillmentwebhookController);

    consumer.apply(GetUserMiddleware).forRoutes(VideoAccessController);

    consumer.apply(AuthenticationMiddleware).forRoutes(
      PurchaseCourseController,
      CustomJwtController,
      ActivatePlanController,
      CancelPlanController
    );

    consumer.apply(JsonBodyMiddleware).forRoutes(
      PurchaseCourseController,
      CustomJwtController,
      ActivatePlanController,
      CancelPlanController,
      VideoAccessController
    );
  }

}
