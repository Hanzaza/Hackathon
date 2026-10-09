# ==============================================================================
# BACKEND DOCKERFILE - Multi-stage Production Build (Node.js + Express)
# Entregable 4: Contenedor con usuario seguro no-root
# ==============================================================================

# Etapa 1: Dependencias y Compilación
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar dependencias necesarias para compilar
COPY package*.json ./
RUN npm install

# Copiar código fuente y compilar TypeScript a JavaScript
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Etapa 2: Imagen de Producción Mínima y Segura
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

# Instalar únicamente dependencias de producción
COPY package*.json ./
RUN npm install --omit=dev && npm cache clean --force

# Copiar los archivos compilados desde la etapa anterior
COPY --from=builder /app/dist ./dist

# Seguridad: Ejecutar bajo el usuario estándar 'node' (no-root)
USER node

EXPOSE 4000

CMD ["node", "dist/server.js"]
