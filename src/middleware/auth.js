const { pool } = require('../db');
module.exports = async function auth(req, res, next) {
  try {
    const key = req.header('x-api-key');
    if (!key) return res.status(401).json({ error: 'Missing API key' });
    const { rows } = await pool.query('SELECT * FROM tenants WHERE api_key = $1', [key]);
    if (!rows[0]) return res.status(401).json({ error: 'Invalid API key' });
    req.tenant = rows[0];
    next();
  } catch (err) {
    res.status(500).json({ error: 'Auth failure' });
  }
};