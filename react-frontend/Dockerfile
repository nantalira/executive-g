# Multi-stage build for React frontend
# Stage 1: Build
FROM node:20-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies needed for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve
FROM node:20-alpine as serve

RUN npm install -g serve

WORKDIR /app

COPY --from=build /app/dist ./dist

CMD ["serve", "-s", "dist"]
# Expose port 3000
EXPOSE 3000