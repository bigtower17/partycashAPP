# Utilizza un'immagine base Node.js
FROM node:16-alpine

# Imposta la directory di lavoro
WORKDIR /app

# Copia package.json e package-lock.json
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Copia il resto dell’applicazione
COPY . .

# Espone la porta utilizzata dal back-end (es. 3001)
EXPOSE 3001

# Avvia l'applicazione
CMD ["node", "index.js"]
