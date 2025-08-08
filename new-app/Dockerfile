FROM node:20-alpine AS base

WORKDIR /app

COPY package.json ./
COPY pnpm-lock.yaml* ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .

RUN pnpm build

CMD ["pnpm", "start"]
