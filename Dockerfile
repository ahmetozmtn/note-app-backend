# Base stage
FROM node:22-alpine AS base

WORKDIR /app

COPY package*.json ./

# Development stage
FROM base AS development

RUN npm ci

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeapp -u 1001 -G nodejs

COPY --chown=nodeapp:nodejs . .

RUN mkdir -p logs && chown -R nodeapp:nodejs logs

USER nodeapp

EXPOSE 5000

CMD ["npm", "run", "dev"]

# Builder stage (for production dependencies)
FROM base AS builder

RUN npm install --omit=dev

# Production stage
FROM node:22-alpine AS production

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeapp -u 1001 -G nodejs

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules

COPY --chown=nodeapp:nodejs . .

RUN mkdir -p logs && chown -R nodeapp:nodejs logs

USER nodeapp

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "fetch('http://localhost:5000/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "server.js"]