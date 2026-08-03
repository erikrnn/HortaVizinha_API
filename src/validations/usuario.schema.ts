import { z } from 'zod';

export const cadastrarUsuarioSchema = z.object({
  nome: z.string().min(2),
  email: z.string().email(),
  senha: z.string().min(6),
  papel: z.enum(['produtor', 'consumidor', 'administrador']).default('consumidor'),
});

export const loginSchema = z.object({
  email: z.string().email(),
  senha: z.string().min(6),
});

export const atualizarLocalizacaoSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  endereco_aproximado: z.string().min(3).optional(),
});

export const atualizarPerfilSchema = z.object({
  nome: z.string().min(2).optional(),
  email: z.string().email().optional(),
});
