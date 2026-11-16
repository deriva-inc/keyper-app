# syntax=docker/dockerfile:1

# ==============================================================================
# Stage 1: Install dependencies with pnpm
# ==============================================================================
FROM node:24-alpine AS deps

RUN apk upgrade --no-cache && apk add --no-cache libc6-compat && corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ==============================================================================
# Stage 2: Build Next.js standalone production bundle
# ==============================================================================
FROM node:24-alpine AS builder

ARG VERSION=dev
ARG GIT_COMMIT=none
ARG BUILD_DATE=unknown

RUN corepack enable

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN pnpm build

# ==============================================================================
# Stage 3: Minimal production runtime
# ==============================================================================
FROM node:24-alpine AS runner

ARG VERSION=dev
ARG GIT_COMMIT=none
ARG BUILD_DATE=unknown

RUN apk upgrade --no-cache

LABEL org.opencontainers.image.version="${VERSION}" \
      org.opencontainers.image.revision="${GIT_COMMIT}" \
      org.opencontainers.image.created="${BUILD_DATE}"

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3005
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3005

CMD ["node", "server.js"]
