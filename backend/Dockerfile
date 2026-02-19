# ── Stage 1: Build ──────────────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

# Dependências primeiro (cache layer)
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

RUN pnpm install --frozen-lockfile

# Gera o Prisma Client
RUN pnpm exec prisma generate

# Compila o TypeScript
COPY tsconfig.json ./
COPY src ./src/

RUN pnpm run build

# ── Stage 2: Production ──────────────────────────────────────────────────────
FROM node:22-alpine AS production
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

# Copia artefatos do builder
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
COPY --from=builder /app/prisma ./prisma/
COPY --from=builder /app/node_modules ./node_modules/
COPY --from=builder /app/dist ./dist/

EXPOSE 3001

# Roda as migrations pendentes e sobe o servidor
CMD ["sh", "-c", "node_modules/.bin/prisma migrate deploy && node dist/main.js"]
