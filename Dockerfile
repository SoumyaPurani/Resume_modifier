FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:22-alpine AS server-deps

WORKDIR /server
COPY server/package.json server/package-lock.json ./
RUN npm ci --omit=dev

FROM node:22-alpine AS runner

RUN addgroup -g 1001 appgroup && adduser -u 1001 -G appgroup -s /bin/sh -D appuser

WORKDIR /app

COPY --chown=appuser:appgroup --from=builder /app/dist ./dist
COPY --chown=appuser:appgroup --from=server-deps /server/node_modules ./server/node_modules
COPY --chown=appuser:appgroup server ./server

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

USER appuser

WORKDIR /app/server
CMD ["node", "index.js"]
