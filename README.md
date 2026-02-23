# GymAI — Personal Trainer com IA

Aplicação web fullstack que gera planos de treino personalizados com inteligência artificial. O usuário preenche um perfil de academia, e o sistema usa GPT-4o para criar um programa de treino semanal completo, com exercícios, séries, repetições e vídeos do YouTube.

---

## Funcionalidades

- **Onboarding guiado** — formulário multi-etapas para coletar objetivo, nível, equipamentos, lesões e preferências
- **Geração de treino com IA** — plano semanal personalizado gerado pelo GPT-4o via LangChain (limite de 2 treinos por usuário)
- **Vídeos de exercícios** — links do YouTube enriquecidos automaticamente para cada exercício
- **Busca de exercícios** — pesquisa por nome com GIFs, músculos alvo, instruções e equipamentos (dados do ExerciseDB)
- **Autenticação** — login via WorkOS (OAuth/SSO)
- **Dashboard** — visualização e histórico dos treinos gerados

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 16 (App Router) + React 19 + Tailwind CSS 4 |
| Backend | Fastify 5 + TypeScript |
| Banco de dados | PostgreSQL 16 via Docker |
| ORM | Prisma 6 |
| IA | OpenAI GPT-4o via LangChain |
| Autenticação | WorkOS AuthKit |
| Vídeos | YouTube Data API v3 |
| DI | Inversify |
| Validação | Zod |

---

## Arquitetura

```
Browser (Next.js :3000)
    ↓
Next.js API Routes (BFF)          ← autenticação WorkOS, proteção IDOR
    ↓  [x-internal-secret]
Fastify Backend (:3001)           ← DDD: Domain / Application / Infrastructure
    ↓
Prisma ORM → PostgreSQL (:5432)

Serviços externos:
  OpenAI GPT-4o  ← geração do treino
  YouTube API    ← vídeos dos exercícios
  ExerciseDB API ← catálogo de exercícios (com cache no PostgreSQL)
```

O backend segue **Domain-Driven Design** com as camadas:
- `domain/` — aggregates, repositórios (interfaces), regras de negócio
- `application/` — use cases, DTOs
- `infrastructure/` — Prisma repositories, providers (OpenAI, YouTube)
- `interface/` — rotas Fastify, controllers

---

## Pré-requisitos

- [Node.js 20+](https://nodejs.org)
- [pnpm](https://pnpm.io) (`npm install -g pnpm`)
- [Docker](https://www.docker.com)

---

## Configuração

### 1. Clone e instale dependências

```bash
git clone <url-do-repositório>
cd GymWorkoutWebApp

# Backend
cd backend && pnpm install

# Frontend
cd ../frontend && pnpm install
```

### 2. Variáveis de ambiente

**Backend** — crie `backend/.env` a partir do exemplo:

```env
DATABASE_URL=postgresql://gymuser:gympass@localhost:5432/gymdb
PORT=3001
OPENAI_API_KEY=sk-...          # obrigatório
YOUTUBE_API_KEY=...            # obrigatório para vídeos
ALLOWED_ORIGIN=http://localhost:3000
INTERNAL_API_SECRET=           # opcional em dev
```

**Frontend** — crie `frontend/.env.local` seguindo a documentação do [WorkOS AuthKit para Next.js](https://workos.com/docs/user-management/1-configure-your-project/configure-a-redirect-uri):

```env
WORKOS_CLIENT_ID=client_...
WORKOS_API_KEY=sk_...
WORKOS_REDIRECT_URI=http://localhost:3000/callback
NEXT_PUBLIC_WORKOS_CLIENT_ID=client_...
NEXTAUTH_SECRET=...
NEXT_PUBLIC_API_URL=http://localhost:3000
INTERNAL_API_URL=http://localhost:3001
INTERNAL_API_SECRET=           # deve coincidir com o backend
```

### 3. Banco de dados

```bash
# Sobe o PostgreSQL via Docker
docker compose up -d

# Aplica as migrations e gera o Prisma Client
cd backend
pnpm prisma:migrate
pnpm prisma:generate
```

---

## Rodando em desenvolvimento

```bash
# Terminal 1 — Backend
cd backend
pnpm dev           # http://localhost:3001

# Terminal 2 — Frontend
cd frontend
pnpm dev           # http://localhost:3000
```

Documentação Swagger disponível em `http://localhost:3001/docs`.

---

## Scripts

### Backend (`backend/`)

| Comando | Descrição |
|---------|-----------|
| `pnpm dev` | Servidor em watch mode (`tsx watch`) |
| `pnpm build` | Compila TypeScript |
| `pnpm start` | Inicia build de produção |
| `pnpm prisma:migrate` | Executa migrations do Prisma |
| `pnpm prisma:generate` | Gera o Prisma Client |

### Frontend (`frontend/`)

| Comando | Descrição |
|---------|-----------|
| `pnpm dev` | Servidor Next.js em desenvolvimento |
| `pnpm build` | Build de produção |
| `pnpm start` | Inicia build de produção |
| `pnpm lint` | ESLint |

---

## API — Endpoints principais

> O backend exige o header `x-internal-secret` em todos os endpoints (exceto `/docs` e `/exercises`). Em desenvolvimento, pode deixar `INTERNAL_API_SECRET` vazio para desabilitar.

### Usuários
| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/users` | Cria ou recupera usuário |

### Perfil de Academia
| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/gym-profile` | Cria/atualiza perfil |
| `GET` | `/gym-profile/:userId` | Busca perfil do usuário |

### Exercícios
| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/exercises/:name` | Busca exercícios por nome |

### Treinos
| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/workout/generate` | Gera treino com IA (máx. 2 por usuário) |
| `GET` | `/workout/:id` | Busca treino por ID |
| `GET` | `/workout/user/:userId` | Lista treinos do usuário |

---

## Banco de dados — Modelos

```
User
 ├─ GymProfile (1:1)   — respostas do formulário em JSON flexível
 └─ Workout    (1:N)   — planos gerados pela IA

Workout
 └─ WorkoutExercise (1:N) — exercícios com sets, reps, carga, RPE

Exercise
 └─ WorkoutExercise (1:N)
 └─ ExerciseVideoCache (1:1) — cache de vídeos do YouTube
```

---

## Produção (Docker Compose)

```bash
# Crie backend/.env com as variáveis de produção (ver .env.prod.example)
docker compose -f docker-compose.prod.yml up -d --build
```

O compose de produção sobe PostgreSQL e Backend em rede interna. O frontend Next.js pode ser hospedado separadamente (Vercel, etc.) ou adicionado ao compose.

---

## Segurança

- **IDOR Protection** — o BFF valida que `user.id` da sessão coincide com o `userId` da requisição
- **Internal API Secret** — o backend rejeita requisições sem o header `x-internal-secret`
- **Session-based auth** — o `userId` é sempre extraído do token de sessão WorkOS, nunca do body do cliente
- **Limite de treinos** — máximo de 2 treinos por usuário, validado no use case do backend

---

## Estrutura de pastas

```
GymWorkoutWebApp/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   └── src/
│       ├── domain/            # aggregates, repositórios (interfaces)
│       ├── application/       # use cases, DTOs
│       ├── infrastructure/    # Prisma repos, providers (OpenAI, YouTube)
│       └── interface/         # Fastify routes, controllers
├── frontend/
│   └── src/
│       ├── app/               # Next.js App Router (pages + API routes)
│       ├── components/        # UI components
│       ├── services/          # cliente da API
│       └── types/             # TypeScript types
└── docker-compose.yml
```
