/**
 * Vercel Serverless Function: /api/news
 * Proxies requests to NewsAPI so the browser never talks to NewsAPI directly.
 */
module.exports = async (req, res) => {
  try {
    const q = typeof req.query?.q === "string" ? req.query.q.trim() : "";
    if (!q) {
      res.statusCode = 400;
      return res.json({ error: "Missing query param: q" });
    }

    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) {
      res.statusCode = 500;
      return res.json({ error: "Server misconfigured: NEWS_API_KEY not set" });
    }

    const url = new URL("https://newsapi.org/v2/everything");
    url.searchParams.set("q", q);
    url.searchParams.set("apiKey", apiKey);

    const upstream = await fetch(url.toString(), {
      headers: {
        "User-Agent": "pulse-news-vercel-proxy",
      },
    });

    const data = await upstream.json();

    // Avoid caching breaking "live search"
    res.setHeader("Cache-Control", "no-store");
    res.statusCode = upstream.status;
    return res.json(data);
  } catch (err) {
    res.statusCode = 500;
    return res.json({ error: "Unexpected server error" });
  }
};

