import {NextFunction, Request, Response} from 'express';


export function keepEndpointAliveMiddleware(req: Request, res: Response, next: NextFunction) {

  const isPingRequest = req.query['keepAlive'];

  if (isPingRequest) {
    res.status(200).json({message: "Endpoint keep alive request received."});
  }
  else {
    next();
  }

}
