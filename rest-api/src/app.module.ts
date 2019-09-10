import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import { StripeFulfillmentwebhookController } from './controllers/stripe-fulfillmentwebhook.controller';
import { FirestoreService } from './services/firestore.service';
import {RawBodyMiddleware} from './controllers/raw-body.middleware';
import {JsonBodyMiddleware} from './controllers/json-body.middleware';

@Module({
  imports: [],
  controllers: [StripeFulfillmentwebhookController],
  providers: [FirestoreService],
})
export class AppModule implements NestModule {

  public configure(consumer: MiddlewareConsumer): void {

    consumer.apply(RawBodyMiddleware).forRoutes(StripeFulfillmentwebhookController);

    //consumer.apply(JsonBodyMiddleware).forRoutes('*');
  }

}
