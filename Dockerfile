# ---- Build stage ----
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- Production stage ----
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist
COPY server ./server

ENV NODE_ENV=production
ENV PORT=3001
ENV DB_PATH=/app/data/app.db

VOLUME ["/app/data"]

EXPOSE 3001

CMD ["node", "server/index.js"]