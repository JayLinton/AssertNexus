FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY site/package.json site/package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY site/ .

# Set build-time env vars
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Copy .env.local if exists (for build-time env vars)
COPY site/.env.local* ./

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public assets
COPY --from=builder /app/public ./public

# Copy standalone server
COPY --from=builder /app/.next/standalone ./

# Copy static files
COPY --from=builder /app/.next/static ./.next/static

# Create docs directory with proper permissions
RUN mkdir -p /app/docs && chown -R nextjs:nodejs /app/docs

# Create .env.local for runtime env vars
RUN touch .env.local && chown nextjs:nodejs .env.local

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
