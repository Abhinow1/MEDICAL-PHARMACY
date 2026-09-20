# ---- Stage 1: Build Frontend ----
FROM node:20-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# ---- Stage 2: Production Server ----
FROM node:20-alpine
WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV PORT=5001

# Install server dependencies
COPY server/package*.json ./server/
RUN cd server && npm install --omit=dev

# Copy server code
COPY server/ ./server/

# Copy built frontend from Stage 1 into client/dist
COPY --from=client-builder /app/client/dist ./client/dist

# Expose server port
EXPOSE 5001

# Start the fullstack pharmacy server
CMD ["node", "server/server.js"]
