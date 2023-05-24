import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';

export const CORRELATION_ID_HEADER = 'X-Correlation-id'

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const id = randomUUID();
    req[CORRELATION_ID_HEADER] = id;
    res.set(CORRELATION_ID_HEADER, id);
    next();
  }
}
