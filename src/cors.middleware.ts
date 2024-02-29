// create a file cors.middleware.ts

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CorsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {

    console.log("TESTE MIDLLEWARE");

    console.log('req: ', req);

    res.header('Access-Control-Allow-Origin', 'https://lulugonn.github.io/');

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    res.setHeader('Access-Control-Allow-Credentials', 'true');

    //const origin = req.headers.origin as string;

    req.headers['access-control-allow-origin'] = 'https://lulugonn.github.io/';

    req.headers['access-control-allow-methods'] = 'GET, POST, OPTIONS, PUT, PATCH, DELETE';

    req.headers['access-control-allow-headers'] = 'X-Requested-With,content-type';

    req.headers['access-control-allow-credentials'] = 'true';

    console.log('req: ', req, 'RES: ', res);

    if (req.method === 'OPTIONS') {

        console.log(" chegou no options");
        res.status(200).end();
        return;
      }

    next();
  }
}
