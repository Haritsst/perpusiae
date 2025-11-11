// server.js
const express = require('express');
const app = express();
const loanRoutes = require('./routes/loanRoutes');

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'loan-service' });
});

app.use('/api/loans', loanRoutes);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Loan Service running on port ${PORT}`);
});

module.exports = app;
