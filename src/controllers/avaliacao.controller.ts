import { Request, Response } from 'express';
import { AvaliacaoService } from '../services/avaliacao.service';
import { criarAvaliacaoSchema, atualizarAvaliacaoSchema } from '../validations/avaliacao.schema';

export const AvaliacaoController = {
  async criar(req: Request, res: Response) {
    const dados = criarAvaliacaoSchema.parse(req.body);
    const avaliacao = await AvaliacaoService.criar(req.usuario!.id, dados);
    return res.status(201).json(avaliacao);
  },

  async listarPorUsuario(req: Request, res: Response) {
    const avaliacoes = await AvaliacaoService.listarPorAvaliado(req.params.usuarioId);
    return res.json(avaliacoes);
  },

  async buscarPorId(req: Request, res: Response) {
    const avaliacao = await AvaliacaoService.buscarPorId(req.params.id);
    return res.json(avaliacao);
  },

  async atualizar(req: Request, res: Response) {
    const dados = atualizarAvaliacaoSchema.parse(req.body);
    const avaliacao = await AvaliacaoService.atualizar(req.params.id, req.usuario!.id, dados);
    return res.json(avaliacao);
  },

  async deletar(req: Request, res: Response) {
    await AvaliacaoService.deletar(req.params.id, req.usuario!.id);
    return res.status(204).send();
  },
};
