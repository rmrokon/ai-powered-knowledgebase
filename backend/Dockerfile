# Dockerfile

FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies first (for better caching)
COPY package.json yarn.lock ./
RUN yarn install

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose port
EXPOSE 5000

# Run in development mode
CMD ["yarn", "dev"]
