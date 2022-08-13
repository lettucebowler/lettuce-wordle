# FROM node:18

# WORKDIR /app
# COPY package.json pnpm-lock.yaml ./


# # RUN npm install -g pnpm
# # RUN pnpm install

# RUN curl https://bun.sh/install | bash
# RUN /root/.bun/bin/bun install

# COPY . .

# RUN pnpm build

# FROM node:18-slim

# WORKDIR /app
# COPY --from=0 /app .
# COPY . .

# EXPOSE 3000
# CMD ["node", "build"]

from jarredsumner/bun:edge
WORKDIR /app
COPY package.json bun.lockb ./

RUN bun install

copy . .

RUN bun run build

FROM node:18-slim
workdir /app
copy --from=0 /app .
copy . .
expose 3000
CMD ["bun", "build/index.js"]