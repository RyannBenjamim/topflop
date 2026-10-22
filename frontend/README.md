# TopFlop — Frontend

Frontend em React + TypeScript + Vite da rede social de reviews de filmes **TopFlop**, conectado à `topflop-api` (NestJS).
Os dados dos filmes (título, pôster, sinopse, trailer) vêm do TMDB; a API guarda só o `tmdbId`.

## Rodando

```bash
cp .env.example .env   # preencha VITE_TMDB_API_KEY
npm install
npm run dev
```

A `topflop-api` precisa estar rodando (por padrão em `http://localhost:3000`). Ela não habilita CORS,
então em desenvolvimento o navegador chama `/api/...` e o proxy do Vite repassa para `VITE_API_PROXY_TARGET`.

| Variável                | Uso                                                              |
| ----------------------- | ---------------------------------------------------------------- |
| `VITE_API_BASE_URL`     | Base do axios para a API (padrão `/api`)                         |
| `VITE_API_PROXY_TARGET` | Endereço real da API, usado pelo proxy do Vite                   |
| `VITE_TMDB_API_KEY`     | API Key curta ou API Read Access Token (`eyJ...`) do TMDB        |

## Estrutura

```
public/images/              # logos do TopFlop e pôster padrão
src/
├── api/                    # axios (api.ts) + um service por módulo da topflop-api
│   ├── auth.service.ts, users.service.ts, reviews.service.ts,
│   ├── comments.service.ts, follows.service.ts
│   ├── cinema/             # movies, watchlist, highlights
│   ├── likes/              # review-likes, comment-likes
│   └── tmdb/               # dados dos filmes no TMDB
├── components/             # componentes reutilizáveis (Nome/Nome.tsx + styles.module.css)
├── context/                # AuthContext
├── hooks/                  # useAuth, useImageLoader, useTmdbMovies, useUsersDirectory
├── pages/social/           # páginas (+ components/ internos de cada página)
│   └── SocialLayout/       # Header + Outlet + Footer das páginas logadas
├── routes/router.tsx       # rotas e loaders de autenticação
├── styles/index.css        # estilos globais e variáveis de cor (cores da logo)
├── types/                  # tipos de cada módulo da API
└── utils/                  # genericRequest, getHeaders, loaders, validators, formatadores...
```

## Rotas

| Caminho                    | Página                                               |
| -------------------------- | ---------------------------------------------------- |
| `/login`, `/cadastro`      | Autenticação                                         |
| `/verificar-email?token=`  | Confirmação de e-mail                                |
| `/`                        | Em alta, reviews recentes e aclamados                |
| `/busca?q=`                | Busca de filmes                                      |
| `/filmes/:tmdb_id`         | Filme: nota TopFlop, lista, Top/Flop do ano, reviews |
| `/reviews/:review_id`      | Review, curtidas e comentários                       |
| `/minha-lista`             | Watchlist do usuário logado                          |
| `/perfil/:username?`       | Perfil com abas: reviews, top-flop, lista, seguidores, seguindo |
| `/comunidade`              | Pessoas para seguir                                  |
| `/conta`                   | Editar nome, usuário e bio; excluir conta            |
