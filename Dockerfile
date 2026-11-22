# -----------------------------------------------------------------------------
# Build Stage — Node 22 Debian Slim (ARM64/x86_64 compatible with Prisma 6)
# -----------------------------------------------------------------------------
FROM node:22-bookworm-slim AS builder

WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json* ./
COPY prisma ./prisma
RUN npm ci --no-audit --no-fund

COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# -----------------------------------------------------------------------------
# Runtime Stage — Node 22 Debian Slim non-root for ECS Fargate ARM64
# -----------------------------------------------------------------------------
FROM node:22-bookworm-slim AS runtime

WORKDIR /app
RUN apt-get update && apt-get upgrade -y \
    && apt-get install -y --no-install-recommends openssl ca-certificates curl \
    && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    TZ=Asia/Ho_Chi_Minh \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN groupadd --gid 1001 flexpay \
    && useradd --uid 1001 --gid 1001 --shell /usr/sbin/nologin --home-dir /app flexpay

COPY --from=builder --chown=1001:1001 /app/package.json ./package.json
COPY --from=builder --chown=1001:1001 /app/next.config.js ./next.config.js
COPY --from=builder --chown=1001:1001 /app/public ./public
COPY --from=builder --chown=1001:1001 /app/.next ./.next
COPY --from=builder --chown=1001:1001 /app/node_modules ./node_modules
COPY --from=builder --chown=1001:1001 /app/prisma ./prisma

USER flexpay
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD sh -c 'curl -fsS "http://localhost:${PORT:-3000}/api/live" || exit 1'

CMD ["npm", "run", "start"]
