FROM oven/bun:1.3.1-alpine AS deps

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile --production --no-progress

FROM oven/bun:1.3.1-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN bun build --compile --target bun --minify server.ts --outfile dist/yt-cipher

FROM alpine:3.22.2 AS runner

COPY --from=builder /app/dist/yt-cipher /usr/local/bin/yt-cipher

RUN addgroup -S yt-cipher && adduser -S yt-cipher -G yt-cipher

ARG PORT=8001
ENV PORT=$PORT
EXPOSE $PORT

USER yt-cipher

CMD ["yt-cipher"]
