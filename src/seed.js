const { pool, init } = require('./db');
(async function(){
  await init();
  const t = await pool.query(
    "INSERT INTO tenants (email, api_key) VALUES ('demo@example.com', 'demo-api-key-12345') ON CONFLICT (email) DO UPDATE SET api_key = EXCLUDED.api_key RETURNING id"
  );
  await pool.query(
    "INSERT INTO widgets (tenant_id, type, title, description, fields, button_text) VALUES ($1, 'signup', 'Get updates', 'Newsletter signup', '[{\"name\":\"email\",\"label\":\"Email\"},{\"name\":\"name\",\"label\":\"Name\"}]', 'Subscribe')",
    [t.rows[0].id]
  );
  const w = await pool.query('SELECT id FROM widgets WHERE tenant_id=$1 ORDER BY created_at DESC LIMIT 1', [t.rows[0].id]);
  console.log('Seeded.');
  console.log('API key:   demo-api-key-12345');
  console.log('Widget ID: ' + w.rows[0].id);
  process.exit(0);
})();