FROM node:18

WORKDIR /app
COPY package.json pnpm-lock.yaml ./

RUN curl -fsSL https://bun.sh/install | bash


# RUN npm install -g pnpm
RUN /root/.bun/bin/bun install

COPY . .

# RUN pnpm build
RUN /root/.bun/bin/bun run build

FROM node:18-slim

WORKDIR /app
COPY --from=0 /app .
COPY . .

EXPOSE 3000
CMD ["/root/.bun/bin/bun", "build/index.js"]