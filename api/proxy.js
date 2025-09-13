import fetch from "node-fetch";

export default async function handler(req, res) {
  const { path } = req.query; // capturamos la ruta que pedirá Angular
  const targetUrl = `https://freeapi.miniprojectideas.com/api/BigBasket/${path}`;

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
      },
      body: req.method === "POST" ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.text();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json");
    res.status(response.status).send(data);
  } catch (error) {
    res.status(500).json({ error: "Proxy error", details: error.message });
  }
}
