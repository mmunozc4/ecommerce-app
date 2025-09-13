export default async function handler(req, res) {
  let path = req.query.path;

  // Aseguramos que siempre sea array
  if (!path) {
    return res.status(400).json({ error: "Path not provided" });
  }
  if (!Array.isArray(path)) {
    path = [path];
  }

  const apiUrl = `https://freeapi.miniprojectideas.com/api/BigBasket/${path.join("/")}`;

  console.log("🔗 Proxying to:", apiUrl);

  try {
    const response = await fetch(apiUrl, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
      },
      body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
    });

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