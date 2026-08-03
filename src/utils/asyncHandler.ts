import { NextFunction, Request, Response } from 'express';

// Express 4 nao captura automaticamente erros de handlers async.
// Este wrapper encaminha qualquer rejeicao para o errorMiddleware.
export function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}
