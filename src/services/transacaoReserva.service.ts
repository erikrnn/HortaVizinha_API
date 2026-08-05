import { TransacaoReservaModel } from '../models/transacaoReserva.model';
import { ProdutoModel } from '../models/produto.model';
import { AppError } from '../utils/AppError';

export const TransacaoReservaService = {
  // US06 - reservar um excedente
  async reservar(consumidorId: string, produtoId: string, quantidade: number) {
    const produto = await ProdutoModel.buscarPorId(produtoId);
    if (!produto) throw new AppError('Produto nao encontrado', 404);
    if (produto.status !== 'ativo') throw new AppError('Produto indisponivel', 409);
    if (produto.quantidade_disponivel < quantidade) {
      throw new AppError('Quantidade solicitada indisponivel em estoque', 409);
    }

    const reserva = await TransacaoReservaModel.criar({
      produto_id: produtoId,
      consumidor_id: consumidorId,
      quantidade_reservada: quantidade,
    });

    // bloqueia o item para outros usuarios enquanto aguarda aprovacao
    await ProdutoModel.atualizar(produtoId, { status: 'oculto' } as any);

    return reserva;
  },

  async listarPorConsumidor(consumidorId: string) {
    return TransacaoReservaModel.listarPorConsumidor(consumidorId);
  },

  // Reservas pendentes de aprovacao para o produtor logado (Figura 03 - "Analisa reserva pendente")
  async listarPendentesPorProdutor(produtorId: string) {
    return TransacaoReservaModel.listarPendentesPorProdutor(produtorId);
  },

  // Produtor aprova ou rejeita a reserva pendente
  async atualizarStatus(id: string, produtorId: string, novoStatus: string) {
    const reserva = await TransacaoReservaModel.buscarPorId(id);
    if (!reserva) throw new AppError('Reserva nao encontrada', 404);

    const produto = await ProdutoModel.buscarPorId(reserva.produto_id);
    if (!produto || produto.produtor_id !== produtorId) {
      throw new AppError('Voce nao tem permissao para alterar esta reserva', 403);
    }

    const atualizada = await TransacaoReservaModel.atualizarStatus(id, novoStatus);

    if (novoStatus === 'cancelada') {
      await ProdutoModel.atualizar(reserva.produto_id, { status: 'ativo' } as any);
    }

    if (novoStatus === 'concluida') {
      const restante = produto.quantidade_disponivel - reserva.quantidade_reservada;
      await ProdutoModel.atualizar(reserva.produto_id, {
        quantidade_disponivel: Math.max(restante, 0),
        status: restante > 0 ? 'ativo' : 'esgotado',
      } as any);
    }

    return atualizada;
  },

  // Consumidor cancela/remove a propria reserva, desde que ainda esteja pendente
  async deletar(id: string, consumidorId: string) {
    const reserva = await TransacaoReservaModel.buscarPorId(id);
    if (!reserva) throw new AppError('Reserva nao encontrada', 404);
    if (reserva.consumidor_id !== consumidorId) {
      throw new AppError('Voce nao tem permissao para remover esta reserva', 403);
    }
    if (reserva.status !== 'aguardando_aprovacao') {
      throw new AppError('So e possivel remover reservas que ainda estao aguardando aprovacao', 409);
    }

    await TransacaoReservaModel.deletar(id);
    await ProdutoModel.atualizar(reserva.produto_id, { status: 'ativo' } as any);
  },
};
