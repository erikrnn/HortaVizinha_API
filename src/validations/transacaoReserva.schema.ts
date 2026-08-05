import { z } from 'zod';

export const criarReservaSchema = z.object({
  produto_id: z.string().uuid(),
  quantidade_reservada: z.coerce.number().int().positive(),
});

export const atualizarStatusReservaSchema = z.object({
  status: z.enum(['aguardando_aprovacao', 'aprovada', 'concluida', 'cancelada']),
});
