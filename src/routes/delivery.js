const path = require('path');
const router = require('express').Router();
const { pool } = require('../db');
router.get('/widgets/:id/config', async (req, res) => {
  const { rows } = await pool.query('SELECT id, type, title, description, fields, button_text FROM widgets WHERE id=$1', [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: 'Not found' });
  res.set('Cache-Control', 'public, max-age=60');
  res.json(rows[0]);
});
router.get('/widget.js', (req, res) => {
  res.set('Content-Type', 'application/javascript');
  res.set('Cache-Control', 'public, max-age=31536000, immutable');
  res.sendFile(path.join(__dirname, '..', '..', 'public', 'widget.v1.js'));
});
module.exports = router;