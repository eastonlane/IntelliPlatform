FROM node:22-bullseye-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
ENV NODE_ENV='production'

ARG PNPM_REGISTRY
ENV PNPM_REGISTRY=$PNPM_REGISTRY
ENV GCP_BUILDPACKS=true
# Optional: set up .npmrc with the registry
RUN [ -n "$PNPM_REGISTRY" ] && echo "registry=$PNPM_REGISTRY" >> .npmrc || true

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm -r build

FROM build AS webapp
WORKDIR /usr/src/app
RUN pnpm deploy --filter=webapp --prod /prod/webapp
WORKDIR /prod/webapp
EXPOSE 3000
CMD [ "node", "--env-file=.env", "build" ]

FROM build AS worker
WORKDIR /usr/src/app
RUN pnpm deploy --filter=worker --prod /prod/worker
WORKDIR /prod/worker
CMD [ "node", "--env-file=.env", "./build/index.js" ]
