FROM node:18

WORKDIR /app
COPY package.json pnpm-lock.yaml ./


# RUN npm install -g pnpm
# RUN pnpm install
RUN curl -fsSL https://bun.sh/install | bash
RUN bun install


COPY . .

RUN bun run build

FROM node:18-slim

WORKDIR /app
COPY --from=0 /app .
COPY . .

EXPOSE 3000
CMD ["node", "build"]