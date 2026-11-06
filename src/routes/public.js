const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const { pool } = require('../db');
const { SubmissionSchema } = require('../validate');
const { geoLookup } = require('../services/geo');
const { sendConfirmation } = require('../services/sideEffect');
const submitLimiter = rateLimit({ windowMs: 60000, max: 20, standardHeaders: true, legacyHeaders: false, message: { error: 'Too many submissions, slow down' } });
router.post('/submissions', submitLimiter, async (req, res) => {
  try {
    const raw = JSON.stringify(req.body || {});
    if (raw.length > 10000) return res.status(413).json({ error: 'Payload too large' });
    const parsed = SubmissionSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid payload', details: parsed.error.issues });
    if (parsed.data._hp) return res.status(400).json({ error: 'Spam detected' });
    const w = await pool.query('SELECT tenant_id FROM widgets WHERE id=$1', [parsed.data.widgetId]);
    if (!w.rows[0]) return res.status(404).json({ error: 'Widget not found' });
    const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
    const geo = await geoLookup(ip);
    const ins = await pool.query(
      'INSERT INTO submissions (widget_id, tenant_id, payload, ip, country, city) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, created_at',
      [parsed.data.widgetId, w.rows[0].tenant_id, parsed.data.data, ip, geo && geo.country || null, geo && geo.city || null]
    );
    sendConfirmation(ins.rows[0]).catch(function(){});
    res.status(201).json({ ok: true, id: ins.rows[0].id, enriched: !!geo, provider: geo && geo.provider || null });
  } catch (err) {
    console.error('[SUBMISSION ERROR]', err);
    res.status(500).json({ error: 'Server error' });
  }
});
module.exports = router;