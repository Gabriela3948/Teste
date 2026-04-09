require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initializeSchema } = require('./database/schema');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Initialize DB
initializeSchema();

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/goals', require('./routes/goals'));
app.use('/api/daily', require('./routes/daily'));
app.use('/api/reports', require('./routes/reports'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.listen(PORT, () => {
  console.log(`Life Tracker API running on http://localhost:${PORT}`);
});
