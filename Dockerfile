#---- STAGE 1 - build stage ----
FROM node:11.1.0 as builder

ARG WORKDIR=/service
RUN mkdir -p ${WORKDIR}
WORKDIR ${WORKDIR}

COPY ./ ./

RUN npm install
RUN npm run build
RUN npm prune --production

# ---- STAGE 2 - final image stage ----
FROM node:11.1.0-alpine

ARG WORKDIR=/service
RUN mkdir -p ${WORKDIR}
WORKDIR ${WORKDIR}

COPY --from=builder ${WORKDIR}/node_modules/ ./node_modules
# GCP libraries
RUN npm rebuild
COPY --from=builder ${WORKDIR}/dist ./dist

COPY tsconfig.json .
COPY tsconfig-paths.js .
COPY start.sh .

EXPOSE 8080
CMD ["sh", "start.sh"]
