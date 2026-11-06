require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { init } = require('./db');
const app = express();
app.use(express.json({ limit: '20kb' }));
app.use('/public', cors({ origin: '*', methods: ['GET','POST','OPTIONS'], allowedHeaders: ['Content-Type'] }));
app.use('/public', require('./routes/delivery'));
app.use('/public', require('./routes/public'));
app.use('/api/tenants', require('./routes/tenants'));
app.use('/api/widgets', require('./routes/widgets'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.get('/health', function(_req, res){ res.json({ ok: true }); });
const PORT = process.env.PORT || 3000;
init().then(function(){
  app.listen(PORT, function(){
    console.log('API listening on http://localhost:' + PORT);
  });
}).catch(function(err){
  console.error('DB init failed:', err);
  process.exit(1);
});