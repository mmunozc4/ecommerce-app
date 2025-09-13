// api/proxy/[...path].js
// Vercel serverless function that proxies requests to BigBasket API and enables CORS.
//
// It forwards method, query string and body (simple forwarding).
// Note: keeps it minimal but practical for most JSON APIs.

export default async function handler(req, res) {
  try {
    // Build the suffix path from req.query.path which Vercel fills as array
    const pathArray = req.query.path || [];
    // pathArray can be string or array; normalize
    const suffix = Array.isArray(pathArray) ? pathArray.join('/') : pathArray;

    // Reconstruct query string excluding the path part
    // req.url contains the full path e.g. /api/proxy/GetAllProducts?x=1
    const originalUrl = req.url || '';
    const prefix = `/api/proxy/${suffix}`;
    let qs = '';
    if (originalUrl.includes('?')) {
      qs = originalUrl.slice(originalUrl.indexOf('?')); // includes leading '?'
    }

    const targetUrl = `https://freeapi.miniprojectideas.com/api/BigBasket/${suffix}${qs}`;

    // Read raw body (if any)
    const getRawBody = () =>
      new Promise((resolve, reject) => {
        let data = '';
        req.on('data', chunk => (data += chunk));
        req.on('end', () => resolve(data));
        req.on('error', err => reject(err));
      });

    const rawBody = await getRawBody();

    // Build headers for the outgoing request - copy relevant ones
    const outgoingHeaders = {};
    // copy content-type if present
    if (req.headers['content-type']) {
      outgoingHeaders['Content-Type'] = req.headers['content-type'];
    }

    // Perform fetch (global fetch is available on Vercel runtime)
    const fetchOptions = {
      method: req.method,
      headers: outgoingHeaders,
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : rawBody || undefined,
      redirect: 'follow'
    };

    const fetchRes = await fetch(targetUrl, fetchOptions);

    // Get response text (could be JSON or other)
    const responseText = await fetchRes.text();

    // Set CORS header so browser accepts it
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Forward status and content-type
    res.status(fetchRes.status);
    const ct = fetchRes.headers.get('content-type');
    if (ct) res.setHeader('Content-Type', ct);

    // Send back the raw response
    res.send(responseText);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Proxy error', details: err.message });
  }
}
