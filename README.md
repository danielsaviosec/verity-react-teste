# Cadastro de Usuário

Aplicação React 19 + TypeScript (Vite)

## Stack

- React 19 + TypeScript + Vite 6
- React Hook Form, Zustand, jsPDF, lucide-react
- json-server (API mockada)
- Vitest + Testing Library (testes unitários, cobertura mínima de 80%)
- ESLint + Prettier, Husky + lint-staged

## Como executar

### Localmente

```bash
npm install
npm run dev
```

O comando `dev` sobe, em paralelo, o Vite (`http://localhost:5173`) e o `json-server` (`http://localhost:3001`).
As chamadas do front para `/api/*` são redirecionadas ao `json-server` via proxy do Vite.

## API mockada (json-server)

Os dados ficam em `db.json` e as rotas em `routes.json` (`/api/* → /$1`):

- `GET /api/professions` — lista de profissões.
- `GET /api/ceps/:cep` — endereço por CEP (ex.: `60530320`, `87654321`, `12457890`, `11223344`, `55667788`).

## Docker

`Dockerfile` multi-stage (deps → build → produção). Na etapa de produção, o `json-server`
serve os arquivos estáticos do build **e** a API mockada na porta `4000`.

O `docker-compose.yml` traz dois serviços:

- **dev**: ambiente de desenvolvimento com hot reload (portas `5173` e `3001`).
- **prod**: build de produção servido na porta `4000`.

### Desenvolvimento

```bash
docker compose up dev
```

Acesse `http://localhost:5173/`.

### Produção

```bash
docker compose up prod --build
```

Acesse `http://localhost:4000/`.

Para produção com proxy reverso (Caddy na porta `80`):

```bash
docker compose -f docker-compose.prod.yml up --build
```
