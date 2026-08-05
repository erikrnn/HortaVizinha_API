import { z } from 'zod';

export const criarAvaliacaoSchema = z.object({
  transacao_id: z.string().uuid(),
  avaliado_id: z.string().uuid(),
  nota: z.coerce.number().int().min(1).max(5),
  comentario: z.string().max(500).optional(),
});

export const atualizarAvaliacaoSchema = z.object({
  nota: z.coerce.number().int().min(1).max(5).optional(),
  comentario: z.string().max(500).optional(),
});
