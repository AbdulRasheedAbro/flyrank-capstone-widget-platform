const router = require('express').Router();
const auth = require('../middleware/auth');
const { pool } = require('../db');
router.use(auth);
router.get('/submissions', async (req, res) => {
  const { rows } = await pool.query(
    'SELECT id, widget_id, payload, country, city, created_at FROM submissions WHERE tenant_id=$1 ORDER BY created_at DESC LIMIT 200',
    [req.tenant.id]
  );
  res.json(rows);
});
router.get('/stats', async (req, res) => {
  const perWidget = await pool.query('SELECT widget_id, COUNT(*)::int AS count FROM submissions WHERE tenant_id=$1 GROUP BY widget_id', [req.tenant.id]);
  const geo = await pool.query("SELECT COALESCE(country,'unknown') AS country, COUNT(*)::int AS count FROM submissions WHERE tenant_id=$1 GROUP BY 1 ORDER BY count DESC", [req.tenant.id]);
  const daily = await pool.query("SELECT date_trunc('day', created_at) AS day, COUNT(*)::int AS count FROM submissions WHERE tenant_id=$1 GROUP BY 1 ORDER BY 1", [req.tenant.id]);
  res.json({ perWidget: perWidget.rows, geo: geo.rows, daily: daily.rows });
});
module.exports = router;