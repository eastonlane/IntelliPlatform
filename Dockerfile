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
# Optional: set up .npmrc with the registry
RUN echo "registry=${PNPM_REGISTRY}" >> .npmrc

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm -r build
RUN pnpm deploy --filter=webapp --prod /prod/webapp
RUN pnpm deploy --filter=worker --prod /prod/worker

FROM build AS webapp
WORKDIR /prod/webapp
EXPOSE 3000
CMD [ "node", "--env-file=.env", "build" ]

FROM build AS worker
WORKDIR /prod/worker
CMD [ "pnpm", "start" ]
