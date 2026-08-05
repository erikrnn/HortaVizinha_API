import { AvaliacaoModel } from '../models/avaliacao.model';
import { UsuarioModel } from '../models/usuario.model';
import { TransacaoReservaModel } from '../models/transacaoReserva.model';
import { AppError } from '../utils/AppError';

export const AvaliacaoService = {
  async criar(autorId: string, dados: { transacao_id: string; avaliado_id: string; nota: number; comentario?: string }) {
    const transacao = await TransacaoReservaModel.buscarPorId(dados.transacao_id);
    if (!transacao) throw new AppError('Transacao nao encontrada', 404);
    if (transacao.status !== 'concluida') {
      throw new AppError('Só e possivel avaliar transacoes concluidas', 409);
    }

    const avaliacao = await AvaliacaoModel.criar({
      transacao_id: dados.transacao_id,
      autor_id: autorId,
      avaliado_id: dados.avaliado_id,
      nota: dados.nota,
      comentario: dados.comentario,
    });

    await UsuarioModel.recalcularReputacao(dados.avaliado_id);

    return avaliacao;
  },

  async listarPorAvaliado(avaliadoId: string) {
    return AvaliacaoModel.listarPorAvaliado(avaliadoId);
  },

  async buscarPorId(id: string) {
    const avaliacao = await AvaliacaoModel.buscarPorId(id);
    if (!avaliacao) throw new AppError('Avaliacao nao encontrada', 404);
    return avaliacao;
  },

  // Autor pode corrigir a propria avaliacao (nota e/ou comentario)
  async atualizar(id: string, autorId: string, dados: { nota?: number; comentario?: string }) {
    const avaliacao = await AvaliacaoModel.buscarPorId(id);
    if (!avaliacao) throw new AppError('Avaliacao nao encontrada', 404);
    if (avaliacao.autor_id !== autorId) {
      throw new AppError('Voce nao tem permissao para editar esta avaliacao', 403);
    }

    const atualizada = await AvaliacaoModel.atualizar(id, dados);
    await UsuarioModel.recalcularReputacao(avaliacao.avaliado_id);
    return atualizada;
  },

  // Autor pode remover a propria avaliacao
  async deletar(id: string, autorId: string) {
    const avaliacao = await AvaliacaoModel.buscarPorId(id);
    if (!avaliacao) throw new AppError('Avaliacao nao encontrada', 404);
    if (avaliacao.autor_id !== autorId) {
      throw new AppError('Voce nao tem permissao para remover esta avaliacao', 403);
    }

    await AvaliacaoModel.deletar(id);
    await UsuarioModel.recalcularReputacao(avaliacao.avaliado_id);
  },
};
