import { Request, Response } from 'express';
import { UsuarioService } from '../services/usuario.service';
import { atualizarLocalizacaoSchema, atualizarPerfilSchema } from '../validations/usuario.schema';

export const UsuarioController = {
  async listar(_req: Request, res: Response) {
    const usuarios = await UsuarioService.listar();
    return res.json(usuarios);
  },

  async buscarPerfil(req: Request, res: Response) {
    const usuario = await UsuarioService.buscarPorId(req.usuario!.id);
    return res.json(usuario);
  },

  async atualizarLocalizacao(req: Request, res: Response) {
    const dados = atualizarLocalizacaoSchema.parse(req.body);
    const usuario = await UsuarioService.atualizarLocalizacao(
      req.usuario!.id,
      dados.latitude,
      dados.longitude,
      dados.endereco_aproximado,
    );
    return res.json(usuario);
  },

  async atualizarPerfil(req: Request, res: Response) {
    const dados = atualizarPerfilSchema.parse(req.body);
    const usuario = await UsuarioService.atualizarPerfil(req.usuario!.id, dados);
    return res.json(usuario);
  },

  async deletar(req: Request, res: Response) {
    await UsuarioService.deletar(req.usuario!.id);
    return res.status(204).send();
  },
};
