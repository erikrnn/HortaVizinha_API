CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS usuario (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  papel VARCHAR(20) NOT NULL DEFAULT 'consumidor', -- produtor | consumidor | administrador
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  endereco_aproximado VARCHAR(255),
  reputacao_score DECIMAL(3, 2) DEFAULT 5.0,
  criado_em TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS produto_disponivel (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  produtor_id UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
  nome_produto VARCHAR(150) NOT NULL,
  categoria VARCHAR(80),
  quantidade_disponivel INT NOT NULL DEFAULT 0,
  unidade_medida VARCHAR(20) NOT NULL,
  modalidade VARCHAR(20) NOT NULL, -- venda | troca | doacao
  preco DECIMAL(10, 2),
  foto_produto_url VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'ativo', -- ativo | esgotado | oculto
  criado_em TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transacao_reserva (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  produto_id UUID NOT NULL REFERENCES produto_disponivel(id) ON DELETE CASCADE,
  consumidor_id UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
  quantidade_reservada INT NOT NULL,
  data_reserva TIMESTAMP NOT NULL DEFAULT NOW(),
  status VARCHAR(30) NOT NULL DEFAULT 'aguardando_aprovacao'
);

CREATE TABLE IF NOT EXISTS avaliacao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transacao_id UUID NOT NULL REFERENCES transacao_reserva(id) ON DELETE CASCADE,
  autor_id UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
  avaliado_id UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
  nota INT NOT NULL CHECK (nota BETWEEN 1 AND 5),
  comentario TEXT,
  data_avaliacao TIMESTAMP NOT NULL DEFAULT NOW()
);
