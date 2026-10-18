FROM node:22-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY server server
COPY client client
COPY site site
COPY assets assets

ENV PORT=8787
EXPOSE 8787

CMD ["node", "server/server.js"]
