import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError';
import { ZodError } from 'zod';

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof ZodError) {
    return res.status(422).json({
      erro: 'Erro de validacao',
      detalhes: err.errors.map((e) => ({ campo: e.path.join('.'), mensagem: e.message })),
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ erro: err.message });
  }

  console.error(err);
  return res.status(500).json({ erro: 'Erro interno no servidor' });
}
