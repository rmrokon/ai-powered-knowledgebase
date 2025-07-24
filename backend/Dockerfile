FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile

COPY . .

RUN yarn build

RUN npx prisma generate

RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 5000

CMD ["sh", "-c", "npx prisma db push --accept-data-loss && yarn start"]
