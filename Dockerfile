# Build stage
FROM node:20 AS build
WORKDIR /app
COPY . .
RUN pnpm install
RUN pnpm run build

# Production stage
FROM node:20
WORKDIR /app
COPY --from=build /app/build ./build
COPY --from=build /app/package.json ./
COPY --from=build /app/pnpm-lock.yaml ./
RUN pnpm install --prod

EXPOSE 3000
CMD ["node", "build"]
