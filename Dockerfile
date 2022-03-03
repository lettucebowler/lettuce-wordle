FROM node:16

WORKDIR /app
COPY package.json pnpm-lock.yaml ./


RUN npm install -g pnpm
RUN pnpm install


COPY . .

RUN npm run build

FROM node:16-slim

WORKDIR /app
COPY --from=0 /app .
COPY . .

EXPOSE 3000
CMD ["node", "./build"]