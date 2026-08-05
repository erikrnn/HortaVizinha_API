import { pool } from '../config/database';

export interface ProdutoDisponivel {
  id: string;
  produtor_id: string;
  nome_produto: string;
  categoria: string | null;
  quantidade_disponivel: number;
  unidade_medida: string;
  modalidade: string;
  preco: number | null;
  foto_produto_url: string;
  status: string;
  criado_em: Date;
}

export const ProdutoModel = {
  async criar(dados: Omit<ProdutoDisponivel, 'id' | 'status' | 'criado_em'>) {
    const { rows } = await pool.query(
      `INSERT INTO produto_disponivel
        (produtor_id, nome_produto, categoria, quantidade_disponivel, unidade_medida, modalidade, preco, foto_produto_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [
        dados.produtor_id,
        dados.nome_produto,
        dados.categoria,
        dados.quantidade_disponivel,
        dados.unidade_medida,
        dados.modalidade,
        dados.preco,
        dados.foto_produto_url,
      ],
    );
    return rows[0] as ProdutoDisponivel;
  },

  async listarAtivos() {
    const { rows } = await pool.query(
      `SELECT p.*, u.latitude, u.longitude, u.endereco_aproximado
       FROM produto_disponivel p
       JOIN usuario u ON u.id = p.produtor_id
       WHERE p.status = 'ativo'`,
    );
    return rows;
  },

  async buscarPorId(id: string) {
    const { rows } = await pool.query('SELECT * FROM produto_disponivel WHERE id = $1', [id]);
    return rows[0] as ProdutoDisponivel | undefined;
  },

  async listarPorProdutor(produtorId: string) {
    const { rows } = await pool.query(
      'SELECT * FROM produto_disponivel WHERE produtor_id = $1 ORDER BY criado_em DESC',
      [produtorId],
    );
    return rows as ProdutoDisponivel[];
  },

  async atualizar(id: string, dados: Partial<ProdutoDisponivel>) {
    const campos = Object.keys(dados);
    if (campos.length === 0) return this.buscarPorId(id);

    const setClause = campos.map((campo, i) => `${campo} = $${i + 1}`).join(', ');
    const valores = campos.map((campo) => (dados as any)[campo]);

    const { rows } = await pool.query(
      `UPDATE produto_disponivel SET ${setClause} WHERE id = $${campos.length + 1} RETURNING *`,
      [...valores, id],
    );
    return rows[0] as ProdutoDisponivel;
  },

  async deletar(id: string) {
    await pool.query('DELETE FROM produto_disponivel WHERE id = $1', [id]);
  },
};
