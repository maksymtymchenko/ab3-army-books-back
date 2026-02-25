FROM node:22-alpine AS build

WORKDIR /usr/src/app

COPY package.json package-lock.json* ./
RUN npm install --production=false || npm install --production=false --ignore-scripts

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

FROM node:22-alpine AS runtime

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY package.json package-lock.json* ./
RUN npm install --omit=dev || npm install --omit=dev --ignore-scripts

COPY --from=build /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/server.js"]
