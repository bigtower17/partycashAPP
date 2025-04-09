const express = require('express');
const https = require('https');
const fs = require('fs');
const app = express();
const dotenv = require('dotenv');
const pool = require('./db');
const authRoutes = require('./routes/authRoutes');
const operationRoutes = require('./routes/operationRoutes');
const balanceRoutes = require('./routes/balanceRoutes');
const quoteRoutes = require('./routes/quoteRoutes');
const userRoutes = require('./routes/userRoutes');
const locationRoutes = require('./routes/locationRoutes');
const locationBudgetRoutes = require('./routes/locationBudgetRoutes');
const startingCashRoutes = require('./routes/startingCashRoutes');
const exportRoutes = require('./routes/exportRoutes');
const initializeRoutes = require('./routes/initializeRoutes');

const setupSwagger = require('./utils/swagger');
const cors = require('cors');
const path = require("path");

dotenv.config();

app.use(express.json());
app.use(cors({
  origin: ['https://partycash.me'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Authorization', 'Content-Type'],
}));
setupSwagger(app);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/operations', operationRoutes);
app.use('/api/budget', balanceRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/users', userRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/location-budget', locationBudgetRoutes);
app.use('/api/starting-cash', startingCashRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/admin', initializeRoutes);

// Debug logs
console.log("Auth Routes loaded at /api/auth");
console.log("Operation Routes loaded at /api/operations");
console.log("Balance Routes loaded at /api/budget");
console.log("Quote Routes loaded at /api/quotes");
console.log("User Routes loaded at /api/users");
console.log("Location Routes loaded at /api/locations");
console.log("Location Budget Routes loaded at /api/location-budget");
console.log("Starting Cash Routes loaded at /api/starting-cash");
console.log("Export Routes loaded at /api/export");

const PORT = process.env.PORT || 3000;

// Load SSL certificates
const privateKey = fs.readFileSync('/etc/letsencrypt/live/partycash.me/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/partycash.me/fullchain.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Create HTTPS server
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on https://0.0.0.0:${PORT}`);
});