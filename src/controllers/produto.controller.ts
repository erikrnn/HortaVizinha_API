import { Request, Response } from 'express';
import { ProdutoService } from '../services/produto.service';
import { criarProdutoSchema, atualizarProdutoSchema, buscarPorRaioSchema } from '../validations/produto.schema';

export const ProdutoController = {
  
  async criar(req: Request, res: Response) {
    const dados = criarProdutoSchema.parse(req.body);
    const fotoUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
    const produto = await ProdutoService.criar(req.usuario!.id, dados, fotoUrl);
    return res.status(201).json(produto);
  },

  async listarMeusProdutos(req: Request, res: Response) {
    const produtos = await ProdutoService.listarPorProdutor(req.usuario!.id);
    return res.json(produtos);
  },

  async buscarPorId(req: Request, res: Response) {
    const produto = await ProdutoService.buscarPorId(req.params.id);
    return res.json(produto);
  },

  // US05 - mapa/busca por raio sustentavel
  async buscarPorRaio(req: Request, res: Response) {
    const { latitude, longitude, raioKm } = buscarPorRaioSchema.parse(req.query);
    const produtos = await ProdutoService.buscarPorRaio(latitude, longitude, raioKm);
    return res.json(produtos);
  },

  async atualizar(req: Request, res: Response) {
    const dados = atualizarProdutoSchema.parse(req.body);
    const produto = await ProdutoService.atualizar(req.params.id, req.usuario!.id, dados);
    return res.json(produto);
  },

  async deletar(req: Request, res: Response) {
    await ProdutoService.deletar(req.params.id, req.usuario!.id);
    return res.status(204).send();
  },
};
