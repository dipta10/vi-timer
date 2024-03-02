FROM node:21-alpine3.17

RUN mkdir -p /opt/app
WORKDIR /opt/app

COPY frontend/package.json .
COPY frontend/yarn.lock .
RUN yarn install

COPY frontend/public/ ./public
COPY frontend/src/ ./src
COPY frontend/index.html .
COPY frontend/postcss.config.js .
COPY frontend/tailwind.config.js .
COPY frontend/components.json .
COPY frontend/tsconfig.json .
COPY frontend/tsconfig.node.json .
COPY frontend/vite.config.ts .
COPY frontend/.env .
COPY frontend/axios-progress-bar.d.ts .

EXPOSE 3000

RUN yarn run build
CMD yarn run preview

#CMD tail -f /dev/null

# commands:
# docker build -t fe -f frontend/Dockerfile .
# docker run --rm -p 3000:3000 --name fe fe
# docker exec -it fe sh
# docker stop fe
