# TopFlop - Backend

API REST do **TopFlop**, uma rede social de reviews de filmes. Feita com **NestJS**, **PostgreSQL** e **Prisma**, com tarefas em segundo plano no **BullMQ** (sobre Redis) e e-mails enviados pelo **Resend** com templates em **React Email**.

Os filmes são identificados pelo `tmdbId` do [TMDB](https://www.themoviedb.org/). A API não guarda título, pôster nem sinopse; o frontend busca esses dados direto no TMDB. Aqui ficam só as informações sociais e as métricas de cada filme na plataforma.

> Visão geral do projeto (frontend + backend): [README da raiz](../README.md)

---

## Sumário

- [Stack](#stack)
- [Rodando localmente](#rodando-localmente)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Scripts](#scripts)
- [Funcionalidades](#funcionalidades)
- [Módulos](#módulos)
- [Endpoints](#endpoints)
- [Filas e jobs (BullMQ)](#filas-e-jobs-bullmq)
- [Banco de dados](#banco-de-dados)
- [Padrões do código](#padrões-do-código)

---

## Stack

| Camada | Tecnologia |
| --- | --- |
| Framework | NestJS 11 + TypeScript |
| Banco de dados | PostgreSQL + Prisma 7 (`@prisma/adapter-pg`) |
| Autenticação | JWT (`@nestjs/jwt`) + bcrypt |
| Validação | class-validator + class-transformer |
| Filas | BullMQ + Redis (ioredis) |
| E-mail | Resend + React Email |

---

## Rodando localmente

Pré-requisitos: Node.js 20+, PostgreSQL e Docker (ou um Redis já instalado).

```bash
npm install

# Redis para as filas (porta 6379, com dados persistidos em volume)
docker compose up -d

# crie o arquivo .env (veja a próxima seção)

# cria as tabelas e gera o Prisma Client
npx prisma migrate dev

# API em http://localhost:3000, com reload automático
npm run start:dev
```

Os workers das filas rodam no mesmo processo da API; não há um serviço separado para subir.

---

## Variáveis de ambiente

Crie um arquivo `.env` na pasta `backend/`:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/topflop"
TOKEN_SECRET_KEY="uma-chave-longa-e-aleatoria"
REDIS_URL="redis://localhost:6379"
RESEND_API_KEY="re_..."
FRONTEND_URL="http://localhost:5173"
PORT=3000
```

| Variável | Obrigatória | Uso |
| --- | --- | --- |
| `DATABASE_URL` | Sim | Conexão com o PostgreSQL, usada pelo Prisma |
| `TOKEN_SECRET_KEY` | Sim | Segredo para assinar os JWTs (válidos por 60 minutos) |
| `RESEND_API_KEY` | Sim | Chave do Resend para enviar os e-mails |
| `REDIS_URL` | Não | Redis das filas. Padrão: `redis://localhost:6379` |
| `FRONTEND_URL` | Não | Base dos links nos e-mails (verificação, redefinição de senha). Padrão: `http://localhost:5173` |
| `PORT` | Não | Porta da API. Padrão: `3000` |

O remetente dos e-mails está fixo em [`mail.service.ts`](./src/modules/mail/mail.service.ts). Para enviar com o Resend, o domínio dele precisa estar verificado na sua conta.

As origens liberadas no CORS (`http://localhost:5173` e `https://topflop.vercel.app`) estão em [`main.ts`](./src/main.ts).

---

## Scripts

| Comando | O que faz |
| --- | --- |
| `npm run start:dev` | Sobe a API em modo watch |
| `npm run build` | Compila para `dist/` |
| `npm run start:prod` | Roda a versão compilada (`dist/src/main.js`) |
| `npm run lint` | ESLint com correção automática |
| `npm run format` | Prettier em `src/` e `test/` |
| `npm test` | Testes unitários (Jest) |
| `npm run test:e2e` | Testes end-to-end |

Para produção: `npm run build`, `npx prisma migrate deploy` e `npm run start:prod`.

---

## Funcionalidades

### Autenticação e conta

- Cadastro com envio de e-mail de verificação; a conta só pode entrar depois de confirmar o e-mail
- Reenvio do e-mail de verificação
- Login com JWT (expira em 60 minutos)
- Recuperação de senha por e-mail, com token temporário. A resposta é a mesma para e-mails cadastrados ou não, para não revelar quem tem conta
- E-mail de boas-vindas após a verificação
- Todas as rotas exigem JWT por padrão (guard global); as rotas de autenticação são liberadas com o decorator `@Public()`
- Papéis de usuário `USER` e `ADMIN`

### Perfil

- Nome, nome de usuário e bio editáveis
- Exclusão da conta

### Reviews

- Uma review por usuário para cada filme
- Título, texto e nota em porcentagem (o "Top %")
- A nota média do filme é recalculada em segundo plano sempre que uma review é criada, editada ou excluída

### Interações sociais

- Comentários em reviews
- Curtidas em reviews e em comentários (uma por usuário em cada conteúdo)
- Seguir e deixar de seguir usuários, com listas de seguidores e seguindo

### Cinema

- **Movies**: métricas do filme na plataforma (`reviewCount` e `topSum`, de onde sai a média)
- **Watchlist**: lista de filmes para assistir, sem duplicatas
- **Top & Flop do ano**: cada usuário escolhe o melhor e o pior filme de cada ano. Uma chave composta garante um único registro por usuário por ano

### Notificações

O usuário é notificado quando:

| Tipo | Quando |
| --- | --- |
| `FOLLOW` | Alguém começa a segui-lo |
| `REVIEW_LIKE` | Alguém curte uma review dele |
| `REVIEW_COMMENT` | Alguém comenta uma review dele |
| `COMMENT_LIKE` | Alguém curte um comentário dele |
| `NEW_REVIEW` | Alguém que ele segue publica uma review |

Ninguém é notificado das próprias ações, e curtir/descurtir várias vezes não gera notificações repetidas. Notificações lidas há mais de 90 dias são apagadas automaticamente.

---

## Módulos

A aplicação é dividida por domínio. Cada módulo segue a mesma estrutura (veja [Padrões do código](#padrões-do-código)).

```
src/
├── main.ts                 # bootstrap: CORS, ValidationPipe e filtros globais
├── app.module.ts           # config, conexão do BullMQ e módulos
├── common/
│   ├── filters/            # tratamento global de erros (geral e do Prisma)
│   └── interfaces/         # ApiResponse, AuthenticatedRequest
├── database/               # PrismaModule / PrismaService
├── emails/                 # templates React Email (verificação, boas-vindas, senha)
└── modules/
    ├── auth/               # cadastro, login, verificação de e-mail, senha, guard JWT
    ├── users/              # perfil e conta
    ├── reviews/            # reviews dos filmes
    ├── comments/           # comentários das reviews
    ├── likes/              # ReviewLikes e CommentLikes
    ├── follows/            # seguidores
    ├── cinema/             # agrupa movies, watchlist e highlights (Top & Flop)
    ├── notifications/      # notificações e fila de criação
    └── mail/               # envio de e-mails pela fila
```

---

## Endpoints

Todas as rotas, exceto as de `/auth`, exigem o header `Authorization: Bearer <token>`.

<details>
<summary><strong>Auth</strong> — <code>/auth</code></summary>

| Método | Rota | Descrição |
| --- | --- | --- |
| `POST` | `/auth/register` | Cadastro |
| `POST` | `/auth/signin` | Login, devolve o JWT |
| `GET` | `/auth/verify-email` | Confirma o e-mail com o token do link |
| `POST` | `/auth/resend-verification` | Reenvia o e-mail de verificação |
| `POST` | `/auth/forgot-password` | Envia o e-mail de recuperação de senha |
| `POST` | `/auth/reset-password` | Define a nova senha com o token |

</details>

<details>
<summary><strong>Users</strong> — <code>/users</code></summary>

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/users` | Lista usuários |
| `GET` | `/users/:id` | Perfil de um usuário |
| `PATCH` | `/users/username` | Altera o nome de usuário |
| `PATCH` | `/users/name` | Altera o nome |
| `PATCH` | `/users/bio` | Altera a bio |
| `DELETE` | `/users/:id` | Exclui a conta |

</details>

<details>
<summary><strong>Reviews</strong> — <code>/reviews</code></summary>

| Método | Rota | Descrição |
| --- | --- | --- |
| `POST` | `/reviews` | Publica uma review |
| `GET` | `/reviews` | Reviews recentes |
| `GET` | `/reviews/:id` | Uma review |
| `GET` | `/reviews/movie/:tmdbId` | Reviews de um filme |
| `GET` | `/reviews/user/:userId` | Reviews de um usuário |
| `PATCH` | `/reviews/:id` | Edita uma review |
| `DELETE` | `/reviews/:id` | Exclui uma review |

</details>

<details>
<summary><strong>Comments</strong> — <code>/comments</code></summary>

| Método | Rota | Descrição |
| --- | --- | --- |
| `POST` | `/comments` | Comenta uma review |
| `GET` | `/comments/review/:reviewId` | Comentários de uma review |
| `PATCH` | `/comments/:id` | Edita um comentário |
| `DELETE` | `/comments/:id` | Exclui um comentário |

</details>

<details>
<summary><strong>Likes</strong> — <code>/review-likes</code> e <code>/comment-likes</code></summary>

| Método | Rota | Descrição |
| --- | --- | --- |
| `POST` | `/review-likes` | Curte uma review |
| `DELETE` | `/review-likes/:reviewId` | Remove a curtida |
| `GET` | `/review-likes/review/:reviewId` | Quem curtiu a review |
| `GET` | `/review-likes/status/:reviewId` | Se o usuário logado curtiu |
| `POST` | `/comment-likes` | Curte um comentário |
| `DELETE` | `/comment-likes/:commentId` | Remove a curtida |
| `GET` | `/comment-likes/comment/:commentId` | Quem curtiu o comentário |
| `GET` | `/comment-likes/status/:commentId` | Se o usuário logado curtiu |

</details>

<details>
<summary><strong>Follows</strong> — <code>/follows</code></summary>

| Método | Rota | Descrição |
| --- | --- | --- |
| `POST` | `/follows` | Segue um usuário |
| `DELETE` | `/follows/:followingId` | Deixa de seguir |
| `GET` | `/follows/followers/:userId` | Seguidores de um usuário |
| `GET` | `/follows/following/:userId` | Quem o usuário segue |
| `GET` | `/follows/status/:followingId` | Se o usuário logado segue |

</details>

<details>
<summary><strong>Cinema</strong> — <code>/movies</code>, <code>/watchlist</code> e <code>/highlights</code></summary>

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/movies/:tmdbId` | Métricas do filme no TopFlop |
| `POST` | `/watchlist` | Adiciona um filme à lista |
| `GET` | `/watchlist/user/:userId` | Lista de um usuário |
| `DELETE` | `/watchlist/movie/:movieTmdbId` | Remove um filme da lista |
| `PUT` | `/highlights` | Define o Top e/ou o Flop do ano |
| `GET` | `/highlights/user/:userId` | Top & Flop de todos os anos |
| `GET` | `/highlights/user/:userId/year/:year` | Top & Flop de um ano |
| `DELETE` | `/highlights` | Remove o Top & Flop do ano atual |

</details>

<details>
<summary><strong>Notifications</strong> — <code>/notifications</code></summary>

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/notifications` | Notificações do usuário logado |
| `GET` | `/notifications/unread-count` | Quantidade de não lidas |
| `PATCH` | `/notifications/read-all` | Marca todas como lidas |
| `PATCH` | `/notifications/:id/read` | Marca uma como lida |

</details>

---

## Filas e jobs (BullMQ)

Tarefas que não precisam acontecer durante a requisição rodam em segundo plano, usando o Redis como fila. Por padrão, cada job é tentado até 5 vezes, com espera exponencial a partir de 5 segundos (5s, 10s, 20s...).

| Fila | O que faz | Por quê |
| --- | --- | --- |
| `mail` | Envia os e-mails de verificação, boas-vindas e recuperação de senha | Se o provedor falhar, o cadastro não devolve erro com a conta já criada; o envio é repetido. Erros que não melhoram com nova tentativa (como um e-mail recusado) encerram o job na hora |
| `movie-metrics` | Reconta `reviewCount` e `topSum` do filme a partir das reviews | Mantém a média correta quando uma review muda de nota, troca de filme ou é excluída. Como o valor é recontado do zero, o job pode rodar mais de uma vez sem distorcer o resultado |
| `notifications` | Cria as notificações de seguir, curtir, comentar e nova review | A ação do usuário responde na hora, mesmo quando uma review precisa notificar muitos seguidores |
| `auth-tokens` | Apaga tokens de verificação e de recuperação vencidos | Evita que tokens expirados se acumulem no banco |

Jobs agendados:

| Horário | Job |
| --- | --- |
| Todo dia às 3h00 | Limpeza de tokens vencidos (`auth-tokens`) |
| Todo dia às 3h30 | Limpeza de notificações lidas há mais de 90 dias (`notifications`) |

Os últimos 100 jobs concluídos e 500 com falha ficam guardados no Redis para análise.

---

## Banco de dados

PostgreSQL modelado com Prisma. O schema fica em [`prisma/schema.prisma`](./prisma/schema.prisma) e as migrations em [`prisma/migrations/`](./prisma/migrations).

| Model | O que guarda |
| --- | --- |
| `User` | Conta, perfil, papel e status de verificação do e-mail |
| `Movie` | `tmdbId` e métricas agregadas das reviews |
| `Review` | Review de um usuário sobre um filme (única por usuário + filme) |
| `Comment` | Comentários das reviews |
| `ReviewLike` / `CommentLike` | Curtidas (únicas por usuário + conteúdo) |
| `Follow` | Relação seguidor → seguido |
| `Watchlist` | Filmes que o usuário quer assistir |
| `AnnualHighlight` | Top e Flop do usuário em cada ano |
| `Notification` | Notificações, com autor da ação, destinatário e data de leitura |
| `EmailVerificationToken` / `PasswordResetToken` | Tokens temporários de verificação e de redefinição de senha |

![Diagrama do banco de dados](./topflop_db_diagram.png)

---

## Padrões do código

Cada módulo segue a mesma organização:

```
modules/<modulo>/
├── <modulo>.controller.ts   # rotas
├── <modulo>.service.ts      # regras de negócio
├── <modulo>.module.ts
├── dto/                     # entrada validada com class-validator
├── interfaces/              # formato das respostas
├── mappers/                 # converte o resultado do Prisma na resposta da API
├── prisma/                  # selects reutilizáveis e tipos derivados deles
└── jobs/                    # filas e processors do BullMQ, quando o módulo tem
```

- Toda resposta segue o formato de [`ApiResponse`](./src/common/interfaces/ApiResponse.ts)
- O `ValidationPipe` global rejeita campos que não estão no DTO (`whitelist` + `forbidNonWhitelisted`)
- Erros do Prisma (registro duplicado, não encontrado etc.) são convertidos em respostas HTTP pelo [`PrismaExceptionFilter`](./src/common/filters/prisma-exception-filter.ts)
