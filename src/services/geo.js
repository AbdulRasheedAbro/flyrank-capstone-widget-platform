async function fetchJson(url, timeoutMs = 2500) {
  const r = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
  if (!r.ok) throw new Error('status ' + r.status);
  return r.json();
}
async function geoLookup(ip) {
  const mode = process.env.GEO_MOCK_MODE || 'none';
  if (mode !== 'a_down' && mode !== 'all_down') {
    try {
      const d = await fetchJson(process.env.GEO_PROVIDER_A + ip + '?fields=country,city');
      return { country: d.country || null, city: d.city || null, provider: 'A' };
    } catch (_) {}
  }
  if (mode !== 'all_down') {
    try {
      const d = await fetchJson(process.env.GEO_PROVIDER_B + ip + '/json/');
      return { country: d.country_name || null, city: d.city || null, provider: 'B' };
    } catch (_) {}
  }
  return null;
}
module.exports = { geoLookup };