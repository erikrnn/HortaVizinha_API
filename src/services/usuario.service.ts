import { UsuarioModel } from '../models/usuario.model';
import { AppError } from '../utils/AppError';

export const UsuarioService = {
  async listar() {
    return UsuarioModel.listar();
  },

  async buscarPorId(id: string) {
    const usuario = await UsuarioModel.buscarPorId(id);
    if (!usuario) throw new AppError('Usuario nao encontrado', 404);
    const { senha_hash, ...resto } = usuario;
    return resto;
  },

  async atualizarLocalizacao(id: string, lat: number, lon: number, endereco?: string) {
    const usuario = await UsuarioModel.buscarPorId(id);
    if (!usuario) throw new AppError('Usuario nao encontrado', 404);
    const atualizado = await UsuarioModel.atualizarLocalizacao(id, lat, lon, endereco);
    const { senha_hash, ...resto } = atualizado;
    return resto;
  },

  async atualizarPerfil(id: string, dados: { nome?: string; email?: string }) {
    const usuario = await UsuarioModel.buscarPorId(id);
    if (!usuario) throw new AppError('Usuario nao encontrado', 404);

    if (dados.email) {
      const existente = await UsuarioModel.buscarPorEmail(dados.email);
      if (existente && existente.id !== id) {
        throw new AppError('Ja existe um usuario cadastrado com este e-mail', 409);
      }
    }

    const atualizado = await UsuarioModel.atualizarPerfil(id, dados);
    if (!atualizado) throw new AppError('Usuario nao encontrado', 404);
    const { senha_hash, ...resto } = atualizado;
  },

  async deletar(id: string) {
    const usuario = await UsuarioModel.buscarPorId(id);
    if (!usuario) throw new AppError('Usuario nao encontrado', 404);
    await UsuarioModel.deletar(id);
  },
};
