import { pool } from '../config/database';

export interface TransacaoReserva {
  id: string;
  produto_id: string;
  consumidor_id: string;
  quantidade_reservada: number;
  data_reserva: Date;
  status: string;
}

export const TransacaoReservaModel = {
  async criar(dados: { produto_id: string; consumidor_id: string; quantidade_reservada: number }) {
    const { rows } = await pool.query(
      `INSERT INTO transacao_reserva (produto_id, consumidor_id, quantidade_reservada)
       VALUES ($1,$2,$3) RETURNING *`,
      [dados.produto_id, dados.consumidor_id, dados.quantidade_reservada],
    );
    return rows[0] as TransacaoReserva;
  },

  async buscarPorId(id: string) {
    const { rows } = await pool.query('SELECT * FROM transacao_reserva WHERE id = $1', [id]);
    return rows[0] as TransacaoReserva | undefined;
  },

  async listarPorConsumidor(consumidorId: string) {
    const { rows } = await pool.query(
      'SELECT * FROM transacao_reserva WHERE consumidor_id = $1 ORDER BY data_reserva DESC',
      [consumidorId],
    );
    return rows as TransacaoReserva[];
  },

  async listarPorProduto(produtoId: string) {
    const { rows } = await pool.query('SELECT * FROM transacao_reserva WHERE produto_id = $1', [produtoId]);
    return rows as TransacaoReserva[];
  },

  // Reservas pendentes de todos os produtos de um determinado produtor (para ele aprovar/rejeitar)
  async listarPendentesPorProdutor(produtorId: string) {
    const { rows } = await pool.query(
      `SELECT tr.*, p.nome_produto, p.foto_produto_url
       FROM transacao_reserva tr
       JOIN produto_disponivel p ON p.id = tr.produto_id
       WHERE p.produtor_id = $1 AND tr.status = 'aguardando_aprovacao'
       ORDER BY tr.data_reserva ASC`,
      [produtorId],
    );
    return rows;
  },

  async atualizarStatus(id: string, status: string) {
    const { rows } = await pool.query(
      'UPDATE transacao_reserva SET status = $1 WHERE id = $2 RETURNING *',
      [status, id],
    );
    return rows[0] as TransacaoReserva;
  },

  async deletar(id: string) {
    await pool.query('DELETE FROM transacao_reserva WHERE id = $1', [id]);
  },
};
