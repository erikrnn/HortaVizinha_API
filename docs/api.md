# Documentacao da API - HortaVizinha

Base URL: `http://localhost:3333/api`

Todas as rotas autenticadas exigem o header:
`Authorization: Bearer <token>`

## Auth

| Metodo | Rota | Descricao | Corpo |
|---|---|---|---|
| POST | /auth/registrar | Cria usuario (produtor/consumidor) | nome, email, senha, papel |
| POST | /auth/login | Autentica e retorna token JWT | email, senha |

## Usuarios

| Metodo | Rota | Auth | Descricao |
|---|---|---|---|
| GET | /usuarios | Nao | Lista usuarios (dados publicos) |
| GET | /usuarios/perfil | Sim | Retorna o perfil do usuario logado |
| PUT | /usuarios/perfil | Sim | Atualiza nome e/ou e-mail do proprio perfil |
| PUT | /usuarios/localizacao | Sim | Atualiza latitude/longitude da horta (US02) |
| DELETE | /usuarios/perfil | Sim | Remove a propria conta |

## Produtos

| Metodo | Rota | Auth | Descricao |
|---|---|---|---|
| GET | /produtos/mapa?latitude=&longitude=&raioKm= | Nao | Busca produtos ativos dentro do raio (US05, Haversine) |
| GET | /produtos/meus | Sim (produtor) | Lista os produtos do produtor logado |
| GET | /produtos/:id | Nao | Detalhe de um produto |
| POST | /produtos | Sim (produtor) | Cria produto. multipart/form-data com campo `foto` obrigatorio (US03) |
| PUT | /produtos/:id | Sim (produtor) | Atualiza produto proprio |
| DELETE | /produtos/:id | Sim (produtor) | Remove produto proprio |

## Reservas (Transacao_Reserva)

| Metodo | Rota | Auth | Descricao |
|---|---|---|---|
| POST | /reservas | Sim (consumidor) | Reserva um produto (US06) |
| GET | /reservas/minhas | Sim (consumidor) | Lista as reservas do consumidor logado |
| GET | /reservas/pendentes | Sim (produtor) | Lista reservas aguardando aprovacao dos produtos do produtor logado |
| PATCH | /reservas/:id/status | Sim (produtor) | Aprova, rejeita ou confirma a reserva |
| DELETE | /reservas/:id | Sim (consumidor) | Remove a propria reserva, se ainda estiver aguardando aprovacao |

## Avaliacoes

| Metodo | Rota | Auth | Descricao |
|---|---|---|---|
| POST | /avaliacoes | Sim | Avalia o produtor apos transacao concluida (US06) |
| GET | /avaliacoes/usuario/:usuarioId | Nao | Lista avaliacoes recebidas por um usuario |
| GET | /avaliacoes/:id | Nao | Detalhe de uma avaliacao |
| PUT | /avaliacoes/:id | Sim (autor) | Edita a propria avaliacao (nota e/ou comentario) |
| DELETE | /avaliacoes/:id | Sim (autor) | Remove a propria avaliacao |

Observacao: sempre que uma avaliacao e criada, editada ou removida, a reputacao do
usuario avaliado e recalculada automaticamente como a media de todas as notas recebidas.
