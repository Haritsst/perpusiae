const express = require('express');
const reportRoutes = require('./routes/reportRoutes');
const statisticsRoutes = require('./routes/statisticsRoutes');

const app = express();
app.use(express.json());

app.use('/api/reports', reportRoutes);
app.use('/api/reports', statisticsRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'report-service' }));

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => console.log(`Report Service running on port ${PORT}`));
