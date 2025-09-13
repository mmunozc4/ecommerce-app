export default async function handler(req, res) {
  try {
    const pathArray = req.query.path || [];
    const suffix = Array.isArray(pathArray) ? pathArray.join('/') : pathArray;

    const originalUrl = req.url || '';
    let qs = '';
    if (originalUrl.includes('?')) {
      qs = originalUrl.slice(originalUrl.indexOf('?'));
    }

    const targetUrl = `https://freeapi.miniprojectideas.com/api/BigBasket/${suffix}${qs}`;

    const getRawBody = () =>
      new Promise((resolve, reject) => {
        let data = '';
        req.on('data', chunk => (data += chunk));
        req.on('end', () => resolve(data));
        req.on('error', err => reject(err));
      });

    const rawBody = await getRawBody();

    const outgoingHeaders = {};
    if (req.headers['content-type']) {
      outgoingHeaders['Content-Type'] = req.headers['content-type'];
    }

    const fetchRes = await fetch(targetUrl, {
      method: req.method,
      headers: outgoingHeaders,
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : rawBody || undefined,
    });

    const responseText = await fetchRes.text();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    res.status(fetchRes.status);
    const ct = fetchRes.headers.get('content-type');
    if (ct) res.setHeader('Content-Type', ct);

    res.send(responseText);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Proxy error', details: err.message });
  }
}
