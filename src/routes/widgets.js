const router = require('express').Router();
const auth = require('../middleware/auth');
const { pool } = require('../db');
const { WidgetSchema } = require('../validate');
router.use(auth);
router.post('/', async (req, res) => {
  const parsed = WidgetSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid widget payload', details: parsed.error.issues });
  const w = parsed.data;
  const { rows } = await pool.query(
    'INSERT INTO widgets (tenant_id, type, title, description, fields, button_text) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
    [req.tenant.id, w.type, w.title, w.description || '', JSON.stringify(w.fields || []), w.button_text || 'Submit']
  );
  res.status(201).json(rows[0]);
});
router.get('/', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM widgets WHERE tenant_id=$1 ORDER BY created_at DESC', [req.tenant.id]);
  res.json(rows);
});
router.get('/:id', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM widgets WHERE id=$1 AND tenant_id=$2', [req.params.id, req.tenant.id]);
  if (!rows[0]) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});
router.patch('/:id', async (req, res) => {
  const { title, description, fields, button_text } = req.body || {};
  const { rows } = await pool.query(
    'UPDATE widgets SET title=COALESCE($1,title), description=COALESCE($2,description), fields=COALESCE($3,fields), button_text=COALESCE($4,button_text) WHERE id=$5 AND tenant_id=$6 RETURNING *',
    [title, description, fields ? JSON.stringify(fields) : null, button_text, req.params.id, req.tenant.id]
  );
  if (!rows[0]) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});
router.delete('/:id', async (req, res) => {
  const r = await pool.query('DELETE FROM widgets WHERE id=$1 AND tenant_id=$2', [req.params.id, req.tenant.id]);
  if (r.rowCount === 0) return res.status(404).json({ error: 'Not found' });
  res.status(204).end();
});
router.get('/:id/snippet', async (req, res) => {
  const { rows } = await pool.query('SELECT id FROM widgets WHERE id=$1 AND tenant_id=$2', [req.params.id, req.tenant.id]);
  if (!rows[0]) return res.status(404).json({ error: 'Not found' });
  res.json({ snippet: '<script src="http://localhost:3000/widget.js?id=' + rows[0].id + '"></script>' });
});
module.exports = router;