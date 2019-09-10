

const cors = require('cors');
import {Injectable, NestMiddleware} from '@nestjs/common';
import {Request, Response} from 'express';


@Injectable()
export class CorsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => any) {
    cors({origin: true})(req, res, next);
  }
}
