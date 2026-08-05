import { z } from 'zod';

export const criarProdutoSchema = z.object({
  nome_produto: z.string().min(2),
  categoria: z.string().min(2).optional(),
  quantidade_disponivel: z.coerce.number().int().nonnegative(),
  unidade_medida: z.string().min(1),
  modalidade: z.enum(['venda', 'troca', 'doacao']),
  preco: z.coerce.number().nonnegative().optional(),
});

export const atualizarProdutoSchema = criarProdutoSchema.partial().extend({
  status: z.enum(['ativo', 'esgotado', 'oculto']).optional(),
});

export const buscarPorRaioSchema = z.object({
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  raioKm: z.coerce.number().positive().default(5),
});
