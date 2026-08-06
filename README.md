# HortaVizinha - Backend (API)

API REST do projeto **HortaVizinha**, desenvolvida em Node.js + Express + TypeScript,
seguindo o padrao arquitetural MVC (Controller / Service / Model). Banco de dados: PostgreSQL,
hospedado no Supabase.

## Requisitos

- Node.js 18+
- Uma conta gratuita no Supabase (supabase.com)

## Como rodar

### 1. Instalar as dependencias
```
npm install
```

### 2. Criar o projeto no Supabase
1. Va em supabase.com e crie uma conta (pode ser com GitHub/Google)
2. Clique em "New Project"
3. Escolha um nome, defina uma senha para o banco (anote essa senha) e escolha a regiao mais proxima (ex: South America)
4. Aguarde alguns minutos ate o projeto ficar pronto


### 3. Configurar o .env
Crie o arquivo env e coloque as variaveis.

### 4. Rodar as migrations (cria as 4 tabelas)
```
npm run migrate
```
### 5. Subir o servidor
```
npm run dev
```
A API sobe em `http://localhost:3333`.

## Documentacao da API

Ver [docs/api.md](docs/api.md).

## Estrutura de pastas

```
src/
  config/       -> conexao com o banco (Supabase) e variaveis de ambiente
  models/       -> acesso a dados (SQL) de cada entidade
  services/     -> regras de negocio, isoladas do Express
  controllers/  -> recebe request/response e chama os services
  routes/       -> definicao das rotas por entidade
  middlewares/  -> autenticacao JWT, upload (multer) e tratamento de erros
  validations/  -> schemas de validacao (zod)
  utils/        -> jwt, haversine (calculo de distancia), AppError
  db/           -> script SQL de migrations
```

## Entidades

- **Usuario**: produtor, consumidor ou administrador; guarda localizacao (lat/long) e score de reputacao.
- **Produto_Disponivel**: excedente cadastrado pelo produtor, com foto obrigatoria.
- **Transacao_Reserva**: reserva feita pelo consumidor sobre um produto.
- **Avaliacao**: nota e comentario dados ao produtor apos a retirada.

## Time

Erik Renan, Gabriel Ragalzzi, Joao Victor Ramalho, Livia Alencar - IFPB Campus Cajazeiras.
