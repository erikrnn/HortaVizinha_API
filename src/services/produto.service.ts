import { ProdutoModel } from '../models/produto.model';
import { AppError } from '../utils/AppError';
import { calcularDistanciaKm } from '../utils/haversine';

export const ProdutoService = {
  async criar(produtorId: string, dados: any, fotoUrl?: string) {
    if (!fotoUrl) {
      throw new AppError('A foto do produto e obrigatoria', 422);
    }

    return ProdutoModel.criar({
      produtor_id: produtorId,
      nome_produto: dados.nome_produto,
      categoria: dados.categoria ?? null,
      quantidade_disponivel: dados.quantidade_disponivel,
      unidade_medida: dados.unidade_medida,
      modalidade: dados.modalidade,
      preco: dados.preco ?? null,
      foto_produto_url: fotoUrl,
    });
  },

  async listarPorProdutor(produtorId: string) {
    return ProdutoModel.listarPorProdutor(produtorId);
  },

  async buscarPorId(id: string) {
    const produto = await ProdutoModel.buscarPorId(id);
    if (!produto) throw new AppError('Produto nao encontrado', 404);
    return produto;
  },

  // US05 - busca dinamica por raio sustentavel usando Haversine
  async buscarPorRaio(latitude: number, longitude: number, raioKm: number) {
    const produtos = await ProdutoModel.listarAtivos();
    return produtos
      .filter((p: any) => p.latitude && p.longitude)
      .map((p: any) => ({
        ...p,
        distancia_km: calcularDistanciaKm(latitude, longitude, Number(p.latitude), Number(p.longitude)),
      }))
      .filter((p: any) => p.distancia_km <= raioKm)
      .sort((a: any, b: any) => a.distancia_km - b.distancia_km);
  },

  async atualizar(id: string, produtorId: string, dados: any) {
    const produto = await ProdutoModel.buscarPorId(id);
    if (!produto) throw new AppError('Produto nao encontrado', 404);
    if (produto.produtor_id !== produtorId) {
      throw new AppError('Voce nao tem permissao para alterar este produto', 403);
    }
    return ProdutoModel.atualizar(id, dados);
  },

  async deletar(id: string, produtorId: string) {
    const produto = await ProdutoModel.buscarPorId(id);
    if (!produto) throw new AppError('Produto nao encontrado', 404);
    if (produto.produtor_id !== produtorId) {
      throw new AppError('Voce nao tem permissao para remover este produto', 403);
    }
    await ProdutoModel.deletar(id);
  },
};
