FROM node:22-alpine AS build
RUN corepack enable && corepack prepare pnpm@10.18.3 --activate
WORKDIR /app
ARG API_BASE_URL
ENV API_BASE_URL=$API_BASE_URL
ARG API_TOKEN
ENV API_TOKEN=$API_TOKEN
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN node -e 'const req=["API_BASE_URL","API_TOKEN"];const m=req.filter(v=>!process.env[v]);if(m.length){console.error("Missing build-time env var(s): "+m.join(", ")+"\nPass them with: --build-arg <NAME>=<value>");process.exit(1)}'
RUN pnpm build

FROM nginx:alpine AS serve
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
