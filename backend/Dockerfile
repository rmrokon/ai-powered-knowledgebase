FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile

COPY . .

# Build the app
RUN yarn build

# Generate Prisma client
RUN npx prisma generate

# Use non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 5000

CMD ["sh", "-c", "npx prisma db push --accept-data-loss && yarn start"]
