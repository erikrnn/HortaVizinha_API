import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { cadastrarUsuarioSchema, loginSchema } from '../validations/usuario.schema';

export const AuthController = {
  async registrar(req: Request, res: Response) {
    const dados = cadastrarUsuarioSchema.parse(req.body);
    const resultado = await AuthService.registrar(dados);
    return res.status(201).json(resultado);
  },

  async login(req: Request, res: Response) {
    const dados = loginSchema.parse(req.body);
    const resultado = await AuthService.login(dados.email, dados.senha);
    return res.status(200).json(resultado);
  },
};
