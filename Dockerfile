FROM node:18

WORKDIR /app
COPY package.json bun.lockb ./

# RUN curl https://bun.sh/install | bash
# RUN /root/.bun/bin/bun install

run npm install

COPY . .

RUN npm run build

FROM jarredsumner/bun:edge

WORKDIR /app
COPY --from=0 /app .
COPY . .

EXPOSE 3000
CMD ["bun", "build"]