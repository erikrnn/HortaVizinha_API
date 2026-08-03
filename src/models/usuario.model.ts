import { pool } from '../config/database';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  senha_hash: string;
  papel: string;
  latitude: number | null;
  longitude: number | null;
  endereco_aproximado: string | null;
  reputacao_score: number;
  criado_em: Date;
}

export const UsuarioModel = {
  async criar(dados: { nome: string; email: string; senha_hash: string; papel: string }) {
    const { rows } = await pool.query(
      `INSERT INTO usuario (nome, email, senha_hash, papel)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [dados.nome, dados.email, dados.senha_hash, dados.papel],
    );
    return rows[0] as Usuario;
  },

  async buscarPorEmail(email: string) {
    const { rows } = await pool.query('SELECT * FROM usuario WHERE email = $1', [email]);
    return rows[0] as Usuario | undefined;
  },

  async buscarPorId(id: string) {
    const { rows } = await pool.query('SELECT * FROM usuario WHERE id = $1', [id]);
    return rows[0] as Usuario | undefined;
  },

  async listar() {
    const { rows } = await pool.query('SELECT id, nome, email, papel, reputacao_score FROM usuario');
    return rows as Usuario[];
  },

  async atualizarLocalizacao(id: string, lat: number, lon: number, endereco?: string) {
    const { rows } = await pool.query(
      `UPDATE usuario SET latitude = $1, longitude = $2, endereco_aproximado = COALESCE($3, endereco_aproximado)
       WHERE id = $4 RETURNING *`,
      [lat, lon, endereco ?? null, id],
    );
    return rows[0] as Usuario;
  },

  async atualizarPerfil(id: string, dados: { nome?: string; email?: string }) {
    const campos = Object.keys(dados).filter((k) => (dados as any)[k] !== undefined);
    if (campos.length === 0) return this.buscarPorId(id);

    const setClause = campos.map((campo, i) => `${campo} = $${i + 1}`).join(', ');
    const valores = campos.map((campo) => (dados as any)[campo]);

    const { rows } = await pool.query(
      `UPDATE usuario SET ${setClause} WHERE id = $${campos.length + 1} RETURNING *`,
      [...valores, id],
    );
    return rows[0] as Usuario;
  },

  async atualizarReputacao(id: string, novaNota: number) {
    // media simples entre a reputacao atual e a nova nota recebida
    const { rows } = await pool.query(
      `UPDATE usuario SET reputacao_score = ROUND(((reputacao_score + $1) / 2)::numeric, 2)
       WHERE id = $2 RETURNING *`,
      [novaNota, id],
    );
    return rows[0] as Usuario;
  },

  // Recalcula a reputacao como a media de todas as avaliacoes recebidas pelo usuario.
  // Usado sempre que uma avaliacao e criada, editada ou removida, para manter o score correto.
  async recalcularReputacao(id: string) {
    const { rows } = await pool.query(
      `UPDATE usuario SET reputacao_score = COALESCE(
         (SELECT ROUND(AVG(nota)::numeric, 2) FROM avaliacao WHERE avaliado_id = $1),
         5.0
       )
       WHERE id = $1 RETURNING *`,
      [id],
    );
    return rows[0] as Usuario;
  },

  async deletar(id: string) {
    await pool.query('DELETE FROM usuario WHERE id = $1', [id]);
  },
};
