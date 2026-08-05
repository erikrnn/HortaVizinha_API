import { pool } from '../config/database';

export interface Avaliacao {
  id: string;
  transacao_id: string;
  autor_id: string;
  avaliado_id: string;
  nota: number;
  comentario: string | null;
  data_avaliacao: Date;
}

export const AvaliacaoModel = {
  async criar(dados: {
    transacao_id: string;
    autor_id: string;
    avaliado_id: string;
    nota: number;
    comentario?: string;
  }) {
    const { rows } = await pool.query(
      `INSERT INTO avaliacao (transacao_id, autor_id, avaliado_id, nota, comentario)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [dados.transacao_id, dados.autor_id, dados.avaliado_id, dados.nota, dados.comentario ?? null],
    );
    return rows[0] as Avaliacao;
  },

  async listarPorAvaliado(avaliadoId: string) {
    const { rows } = await pool.query(
      'SELECT * FROM avaliacao WHERE avaliado_id = $1 ORDER BY data_avaliacao DESC',
      [avaliadoId],
    );
    return rows as Avaliacao[];
  },

  async buscarPorId(id: string) {
    const { rows } = await pool.query('SELECT * FROM avaliacao WHERE id = $1', [id]);
    return rows[0] as Avaliacao | undefined;
  },

  async atualizar(id: string, dados: { nota?: number; comentario?: string }) {
    const campos = Object.keys(dados).filter((k) => (dados as any)[k] !== undefined);
    if (campos.length === 0) return this.buscarPorId(id);

    const setClause = campos.map((campo, i) => `${campo} = $${i + 1}`).join(', ');
    const valores = campos.map((campo) => (dados as any)[campo]);

    const { rows } = await pool.query(
      `UPDATE avaliacao SET ${setClause} WHERE id = $${campos.length + 1} RETURNING *`,
      [...valores, id],
    );
    return rows[0] as Avaliacao;
  },

  async deletar(id: string) {
    await pool.query('DELETE FROM avaliacao WHERE id = $1', [id]);
  },
};
