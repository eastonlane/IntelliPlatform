FROM node:22-bullseye-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base as build
COPY . /usr/src/app
WORKDIR /usr/src/app
ENV NODE_ENV='production'
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm -r build
RUN pnpm deploy --filter=webapp --prod /prod/webapp
RUN pnpm deploy --filter=worker --prod /prod/worker

FROM build as webapp
WORKDIR /prod/webapp
CMD [ "pnpm", "start" ]

FROM build as worker
WORKDIR /prod/worker
CMD [ "pnpm", "start" ]
