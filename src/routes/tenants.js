const router = require('express').Router();
const crypto = require('crypto');
const { pool } = require('../db');
router.post('/', async (req, res) => {
  const { email } = req.body || {};
  if (!email || typeof email !== 'string') return res.status(400).json({ error: 'email required' });
  const key = crypto.randomBytes(24).toString('hex');
  try {
    const { rows } = await pool.query('INSERT INTO tenants (email, api_key) VALUES ($1,$2) RETURNING id, email, api_key', [email, key]);
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'email already registered' });
    res.status(500).json({ error: 'Tenant creation failed' });
  }
});
module.exports = router;