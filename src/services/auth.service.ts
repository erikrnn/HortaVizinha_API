import bcrypt from 'bcryptjs';
import { UsuarioModel } from '../models/usuario.model';
import { AppError } from '../utils/AppError';
import { gerarToken } from '../utils/jwt';

export const AuthService = {
  async registrar(dados: { nome: string; email: string; senha: string; papel: string }) {
    const existente = await UsuarioModel.buscarPorEmail(dados.email);
    if (existente) {
      throw new AppError('Ja existe um usuario cadastrado com este e-mail', 409);
    }

    const senha_hash = await bcrypt.hash(dados.senha, 10);
    const usuario = await UsuarioModel.criar({
      nome: dados.nome,
      email: dados.email,
      senha_hash,
      papel: dados.papel,
    });

    const token = gerarToken({ id: usuario.id, papel: usuario.papel });
    const { senha_hash: _omitido, ...usuarioSemSenha } = usuario;
    return { usuario: usuarioSemSenha, token };
  },

  async login(email: string, senha: string) {
    const usuario = await UsuarioModel.buscarPorEmail(email);
    if (!usuario) {
      throw new AppError('E-mail ou senha invalidos', 401);
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaValida) {
      throw new AppError('E-mail ou senha invalidos', 401);
    }

    const token = gerarToken({ id: usuario.id, papel: usuario.papel });
    const { senha_hash: _omitido, ...usuarioSemSenha } = usuario;
    return { usuario: usuarioSemSenha, token };
  },
};
