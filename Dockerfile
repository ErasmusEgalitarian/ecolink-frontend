FROM node:20-bookworm-slim AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG EXPO_PUBLIC_API_BASE_URL=http://localhost:5000
ENV EXPO_PUBLIC_API_BASE_URL=$EXPO_PUBLIC_API_BASE_URL

RUN npx expo export --platform web

FROM node:20-bookworm-slim

WORKDIR /app

RUN npm install -g serve@14.2.4

COPY --from=build /app/dist ./dist

EXPOSE 8080

CMD ["serve", "-s", "dist", "-l", "8080"]
