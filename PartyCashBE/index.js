const express = require('express');
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
const startingCashRoutes = require('./routes/startingCashRoutes'); // ✅ NEW
const exportRoutes = require('./routes/exportRoutes');
const initializeRoutes = require('./routes/initializeRoutes');

const setupSwagger = require('./utils/swagger');
const cors = require('cors');
const path = require("path");

dotenv.config();

app.use(express.json());
app.use(cors());
setupSwagger(app);

// API Routes
app.use('/auth', authRoutes);
app.use('/operations', operationRoutes);
app.use('/budget', balanceRoutes);
app.use('/quotes', quoteRoutes);
app.use('/users', userRoutes);
app.use('/locations', locationRoutes);
app.use('/location-budget', locationBudgetRoutes);
app.use('/starting-cash', startingCashRoutes); // ✅ NEW
app.use('/export', exportRoutes);
app.use('/admin', initializeRoutes); // ora POST /admin/reset-db è disponibile

// Debug logs
console.log("Auth Routes loaded at /auth");
console.log("Operation Routes loaded at /operations");
console.log("Balance Routes loaded at /budget");
console.log("Quote Routes loaded at /quotes");
console.log("User Routes loaded at /users");
console.log("Location Routes loaded at /locations");
console.log("Location Budget Routes loaded at /location-budget");
console.log("Starting Cash Routes loaded at /starting-cash");
console.log("Export Routes loaded at /export");

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
