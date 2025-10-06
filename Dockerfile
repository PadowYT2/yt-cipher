FROM oven/bun:1.2.22

WORKDIR /usr/src/app

COPY . ./

RUN bun install

ARG PORT=8001
ENV PORT=$PORT
EXPOSE $PORT

USER bun

CMD ["bun", "start"]
