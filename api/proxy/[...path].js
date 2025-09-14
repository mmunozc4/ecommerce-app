export default async function handler(req, res) {
  let { path } = req.query;
    console.log("👉 Método:", req.method);
  console.log("👉 Query:", req.query);
  console.log("👉 URL:", req.url);
  console.log("👉 Body:", req.body);
  
  console.log("ESTE ES EL PATH", path);

  // Asegurar que siempre sea un array
  if (!Array.isArray(path)) {
    path = [path];
  }

  const apiUrl = `https://freeapi.miniprojectideas.com/api/BigBasket/${path.join("/")}`;
  console.log("Esta es la URL", apiUrl);

  try {
    const response = await fetch(apiUrl, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        ...req.headers,
      },
      body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
    });

    // Intentar parsear JSON, pero fallback a texto si no es válido
    let data;
    try {
      data = await response.json();
    } catch {
      data = await response.text();
    }

    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: "Proxy Error", details: error.message });
  }
}
