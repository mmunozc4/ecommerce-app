export default async function handler(req, res) {
  const { path } = req.query; // ej: ["GetAllProducts"]

  // Construir URL
  const apiUrl = `https://freeapi.miniprojectideas.com/api/BigBasket/${path.join("/")}`;

  console.log("🔗 Proxying to:", apiUrl); // Log en vercel

  try {
    const response = await fetch(apiUrl, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
      },
      body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
    });

    // Obtener la respuesta como texto o JSON
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      res.status(response.status).json(data);
    } else {
      const text = await response.text();
      res.status(response.status).send(text);
    }
  } catch (error) {
    res.status(500).json({ error: "Proxy Error", details: error.message });
  }
}
  