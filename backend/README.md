# Gym Workout API - Backend

Backend da aplicacao Gym Workout, construido com **Fastify**, **Prisma**, **Inversify** e arquitetura **DDD (Domain-Driven Design)**.

## Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Fastify 5
- **ORM**: Prisma (PostgreSQL)
- **DI Container**: Inversify
- **Validacao**: Zod + fastify-type-provider-zod
- **Documentacao**: Swagger UI (OpenAPI)

## Arquitetura

O projeto segue DDD com as seguintes camadas:

```
src/
├── domain/                  # Entidades, agregados e interfaces de repositorio
│   ├── aggregates/          # User, GymProfile, Exercise
│   └── repository/          # Interfaces (UserRepository, ExerciseRepository, etc.)
│
├── application/             # Casos de uso e DTOs
│   ├── use-case/            # CreateUserUseCase, SearchExerciseUseCase, etc.
│   └── dto/
│       ├── input/           # Schemas Zod para validacao de entrada
│       ├── output/          # Response DTOs e mappers
│       └── types.ts         # Symbols do Inversify
│
├── infrastructure/          # Implementacoes concretas
│   ├── di/                  # Configuracao do container Inversify
│   └── persistence/prisma/  # Repositorios Prisma e mappers de persistencia
│
└── interface/http/fastify/  # Camada HTTP
    ├── controllers/         # Controllers (User, GymProfile, Exercise)
    ├── routes/              # Definicao de rotas com schemas Zod
    └── server.ts            # Configuracao do Fastify
```

## Pre-requisitos

- Node.js 22+
- pnpm
- Docker (para PostgreSQL)

## Setup

```bash
# Subir o PostgreSQL
docker compose -f ../docker-compose.yml up -d

# Instalar dependencias
pnpm install

# Gerar o Prisma Client
pnpm run prisma:generate

# Rodar migrations
pnpm run prisma:migrate

# Iniciar em modo desenvolvimento
pnpm run dev
```

## Scripts

| Comando | Descricao |
|---|---|
| `pnpm run dev` | Inicia o servidor em modo watch (porta 3001) |
| `pnpm run build` | Compila TypeScript |
| `pnpm run start` | Inicia o servidor em producao |
| `pnpm run prisma:generate` | Gera o Prisma Client |
| `pnpm run prisma:migrate` | Roda migrations do Prisma |

## Endpoints

### Users
| Metodo | Rota | Descricao |
|---|---|---|
| POST | `/users` | Criar um usuario |

### Gym Profile
| Metodo | Rota | Descricao |
|---|---|---|
| POST | `/gym-profile` | Criar/atualizar perfil de academia |

### Exercises
| Metodo | Rota | Descricao |
|---|---|---|
| GET | `/exercises/:name` | Buscar exercicios por nome |

## Documentacao da API

Com o servidor rodando, acesse:

- **Swagger UI**: http://localhost:3001/docs
- **OpenAPI JSON**: http://localhost:3001/docs/json

## Banco de Dados

### Modelos

- **User** - Dados do usuario (email, nome, telefone)
- **GymProfile** - Perfil de academia vinculado ao usuario (respostas em JSON)
- **Exercise** - Exercicios com nome, GIF, musculos alvo, instrucoes
- **Workout** - Treinos gerados/criados por usuario
- **WorkoutExercise** - Tabela de juncao entre Workout e Exercise com prescricao (series, reps, carga, etc.)

## Variaveis de Ambiente

Crie um arquivo `.env` na raiz do backend:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/gymworkout?schema=public"
PORT=3001
```
