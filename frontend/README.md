# TopFlop - Frontend

Interface web do **TopFlop**, a rede social de reviews de filmes. É uma SPA em **React 19 + TypeScript + Vite**, responsiva, com navegação no topo no desktop e barra inferior no celular.

Em produção: **[topflop.vercel.app](https://topflop.vercel.app)**

> Visão geral do projeto (frontend + backend): [README da raiz](../README.md)

![Telas do TopFlop no desktop](../assets/topflop-desktop.png)

---

## De onde vêm os dados

O frontend conversa com duas fontes:

| Fonte | O que fornece |
| --- | --- |
| **API do TopFlop** ([`backend/`](../backend)) | Usuários, reviews, comentários, curtidas, seguidores, watchlist, Top & Flop do ano, notificações e a nota de cada filme na plataforma |
| **[TMDB](https://www.themoviedb.org/)** | Título, pôster, sinopse, gênero, duração, trailer, listas de filmes em alta e busca |

A API guarda só o `tmdbId` dos filmes. As telas juntam as duas fontes: o pôster e a sinopse vêm do TMDB, e a nota e as reviews vêm da API.

---

## Rodando localmente

Pré-requisitos: Node.js 20.19+ e a API do TopFlop rodando (veja o [README do backend](../backend/README.md)).

```bash
npm install
cp .env.example .env   # preencha VITE_TMDB_API_KEY
npm run dev            # http://localhost:5173
```

Em desenvolvimento, o navegador chama `/api/...` e o proxy do Vite ([`vite.config.ts`](./vite.config.ts)) repassa para `VITE_API_PROXY_TARGET`, tirando o prefixo `/api`.

### Variáveis de ambiente

| Variável | Uso |
| --- | --- |
| `VITE_API_BASE_URL` | Base do axios para a API. Em desenvolvimento, `/api` (passa pelo proxy). Em produção, a URL pública da API |
| `VITE_API_PROXY_TARGET` | Endereço real da API, usado só pelo proxy do Vite. Padrão: `http://localhost:3000` |
| `VITE_TMDB_API_KEY` | Chave do TMDB. Aceita a API Key curta ou o API Read Access Token (`eyJ...`) |

### Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Checa os tipos e gera o build em `dist/` |
| `npm run preview` | Serve o build localmente |
| `npm run lint` | ESLint |

---

## Funcionalidades

- **Home**: banner, feed de reviews (recentes ou só de quem você segue) e carrosséis de filmes em alta, aclamados pela crítica e animações
- **Busca** de filmes pelo TMDB
- **Página do filme**: nota no TMDB e no TopFlop, sinopse, trailer, botões de "Quero assistir" e Top/Flop do ano, e as reviews do filme
- **Reviews**: escrever, editar e excluir; curtir; comentar e curtir comentários
- **Perfil** com abas de reviews, Top & Flop de todos os anos, lista, seguidores e seguindo
- **Comunidade**: pessoas para seguir
- **Notificações**: sino com contador de não lidas (atualizado a cada 30 segundos) e página com o histórico
- **Conta**: cadastro com verificação de e-mail, login, recuperação de senha, edição de nome, usuário e bio, e exclusão da conta

---

## Rotas

Rotas públicas:

| Caminho | Página |
| --- | --- |
| `/login` | Login* |
| `/cadastro` | Cadastro* |
| `/esqueci-senha` | Pedir o e-mail de recuperação de senha* |
| `/verificar-email?token=` | Confirmação de e-mail (link enviado por e-mail) |
| `/redefinir-senha?token=` | Definir a nova senha (link enviado por e-mail) |

\* Quem já está logado é redirecionado para a home.

Rotas logadas (quem não está logado vai para `/login`):

| Caminho | Página |
| --- | --- |
| `/` | Home |
| `/busca?q=` | Busca de filmes |
| `/filmes/:tmdb_id` | Página do filme |
| `/filmes/:tmdb_id/reviews` | Todas as reviews de um filme |
| `/reviews` | Feed completo de reviews |
| `/reviews/:review_id` | Review com curtidas e comentários |
| `/minha-lista` | Watchlist do usuário logado |
| `/perfil/:username?` | Perfil. Sem `username`, abre o próprio perfil |
| `/perfil/:username?/top-flop`, `/lista`, `/seguidores`, `/seguindo` | Abas do perfil |
| `/perfil/:username/reviews` | Todas as reviews de um usuário |
| `/comunidade` | Pessoas para seguir |
| `/notificacoes` | Notificações |
| `/conta` | Configurações da conta |

As rotas ficam em [`src/routes/router.tsx`](./src/routes/router.tsx). Os loaders `requireAuth` e `requireNoAuth` ([`src/utils/loaders.ts`](./src/utils/loaders.ts)) decidem o redirecionamento olhando o JWT salvo no `localStorage`.

---

## Estrutura

```
public/                     # favicons e pôster padrão
src/
├── api/                    # axios (api.ts) e um service por módulo da API
│   ├── auth, users, reviews, comments, follows, notifications
│   ├── cinema/             # movies, watchlist, highlights
│   ├── likes/              # review-likes, comment-likes
│   └── tmdb/               # dados dos filmes no TMDB
├── components/             # componentes reutilizáveis (Nome/Nome.tsx + styles.module.css)
├── context/                # AuthContext e NotificationsContext
├── hooks/                  # useAuth, useNotifications, useReviewFeed, useTmdbMovies,
│                           # usePagination, useImageLoader, useUsersDirectory
├── pages/social/           # uma pasta por página (+ components/ internos)
│   └── SocialLayout/       # Header + Outlet + Footer das páginas logadas
├── routes/router.tsx       # rotas e loaders de autenticação
├── styles/index.css        # estilos globais e variáveis de cor
├── types/                  # tipos das respostas da API e do TMDB
└── utils/                  # requisições, token, loaders, validadores e formatadores
```

### Convenções

- Cada componente e página tem sua pasta, com o `.tsx` e um `styles.module.css` (CSS Modules)
- As cores ficam em variáveis CSS em [`src/styles/index.css`](./src/styles/index.css). A cor principal é o amarelo da logo (`--color-primary: #E8B04A`)
- Cada módulo da API tem um service em `src/api/` e os tipos correspondentes em `src/types/`
- Mensagens de erro da API são traduzidas para português em [`translateApiMessage.ts`](./src/utils/translateApiMessage.ts)

---

## Deploy

O frontend está hospedado na **Vercel**. O [`vercel.json`](./vercel.json) redireciona todas as rotas para o `index.html`, para o React Router funcionar ao abrir um link direto ou recarregar a página.

Em produção, defina `VITE_API_BASE_URL` com a URL pública da API, e confira se a origem do frontend está liberada no CORS do backend.
