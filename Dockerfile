FROM node:22-alpine AS build
RUN corepack enable && corepack prepare pnpm@10.18.3 --activate
WORKDIR /app
ARG API_BASE_URL
ENV API_BASE_URL=$API_BASE_URL
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM nginx:alpine AS serve
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
