// server.js
const express = require('express');
const returnRoutes = require('./routes/returnRoutes');

const app = express();
app.use(express.json());

app.use('/api/returns', returnRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'return-service' });
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Return Service running on port ${PORT}`);
});

module.exports = app;
