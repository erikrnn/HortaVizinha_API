import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT) || 3333,
  databaseUrl: process.env.DATABASE_URL || '',
  jwt: {
    secret: process.env.JWT_SECRET || 'segredo_padrao_trocar',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
};

if (!env.databaseUrl) {
  console.warn('AVISO: DATABASE_URL nao definida no .env — a conexao com o banco vai falhar.');
}
