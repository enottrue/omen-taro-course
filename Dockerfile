FROM node:20.10.0-alpine AS base

FROM base AS deps
WORKDIR /app

RUN apk add --no-cache libc6-compat
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=yarn.lock,target=yarn.lock \
    --mount=type=cache,target=/root/.npm \
    --mount=type=cache,target=/root/.yarn \
    yarn set version stable && \
    echo 'nodeLinker: node-modules' >> /app/.yarnrc.yml && \
    yarn --immutable && yarn add sharp



FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn run prisma:generate && yarn run build



FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV PORT 3000
ENV HOSTNAME 0.0.0.0
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
