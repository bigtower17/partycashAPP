# Step 1: Costruzione dell'app
FROM node:18-alpine

WORKDIR /app

# Copia i file di configurazione e installa le dipendenze
COPY package*.json ./
RUN npm install

# Copia il resto del codice
COPY . .

# Esegui il build dell’applicazione
RUN npm run build

# Step 2: Servire il contenuto statico con Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Espone la porta 80
EXPOSE 80

# Il container nginx si avvierà in automatico
