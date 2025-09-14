export default async function handler(req, res) {
  console.log("👉 Método:", req.method);
  console.log("👉 Query:", req.query);
  console.log("👉 URL:", req.url);
  let path = req.query["...path"];

  // Asegurar que siempre sea un array
  if (!Array.isArray(path)) {
    path = [path];
  }

  console.log("👉 PATH:", path);

  const apiUrl = `https://freeapi.miniprojectideas.com/api/BigBasket/${path.join("/")}`;
  console.log("👉 URL Final:", apiUrl);

  try {
    const response = await fetch(apiUrl, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        ...req.headers,
      },
      body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
    });

    let data;
    try {
      data = await response.json();
    } catch {
      data = await response.text();
    }

    res.status(response.status).json(data);
  } catch (error) {
    console.error("❌ Proxy Error:", error);
    res.status(500).json({ error: "Proxy Error", details: error.message });
  }
}
