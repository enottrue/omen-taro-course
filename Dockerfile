FROM node:20.10.0-alpine AS base

FROM base AS deps
WORKDIR /app

RUN apk add --no-cache libc6-compat
COPY package.json yarn.lock ./
RUN yarn set version stable && \
    echo 'nodeLinker: node-modules' >> .yarnrc.yml && \
    yarn --immutable

FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn run prisma:generate && yarn run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV PORT 3001
ENV HOSTNAME 0.0.0.0
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

EXPOSE 3001

CMD ["node", "server.js"]
