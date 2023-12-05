FROM node:21-alpine3.17

RUN mkdir -p /opt/app
WORKDIR /opt/app

COPY backend/package.json .
COPY backend/yarn.lock .
RUN yarn install --production

COPY backend/prisma prisma/
COPY backend/src src/
COPY backend/index.ts .
COPY backend/tsconfig.json .
COPY backend/tsconfig.prod.json .
COPY backend/.env .

EXPOSE 8000
EXPOSE 5555

RUN yarn run build
RUN yarn run prisma generate
CMD yarn run start

#CMD tail -f /dev/null
# commands:
# docker build -t test -f backend/Dockerfile .
# docker run --rm -p 5555:5555 -p 8000:8000 --name test test
# docker exec -it test sh
# docker stop test