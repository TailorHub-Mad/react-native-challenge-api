FROM node:18-alpine AS build
WORKDIR /app
COPY package.json yarn.lock ./
RUN corepack enable && corepack prepare yarn@4.5.0 --activate
RUN yarn install --immutable
COPY . .
RUN yarn build

FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package.json yarn.lock ./
RUN corepack enable && corepack prepare yarn@4.5.0 --activate
RUN yarn install --immutable
COPY --from=build /app/dist ./dist
EXPOSE 3001
CMD ["node", "-r", "module-alias/register", "dist/server.js"]
