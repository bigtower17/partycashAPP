# Step 1: Build dell'app
FROM node:18-alpine AS build

WORKDIR /app

# Build arg per selezionare il config
ARG CONFIG_FILE=staging.config.ts

# Copia package e installa deps
COPY package*.json ./
RUN npm install

# Copia tutto il codice
COPY . .

# Sovrascrivi config.ts con quello scelto
COPY config/${CONFIG_FILE} ./src/config.ts

# Build app
RUN npm run build

# Step 2: Serve statico con nginx
FROM nginx:alpine

# Copia file statici da build
COPY --from=build /app/dist /usr/share/nginx/html

# Copia conf Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
