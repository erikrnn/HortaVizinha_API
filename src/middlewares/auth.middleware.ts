import { NextFunction, Request, Response } from 'express';
import { verificarToken } from '../utils/jwt';
import { AppError } from '../utils/AppError';

export function autenticar(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError('Token nao informado', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const payload = verificarToken(token);
    req.usuario = payload;
    return next();
  } catch {
    throw new AppError('Token invalido ou expirado', 401);
  }
}

export function autorizar(...papeisPermitidos: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.usuario || !papeisPermitidos.includes(req.usuario.papel)) {
      throw new AppError('Acesso nao autorizado para este papel', 403);
    }
    return next();
  };
}
