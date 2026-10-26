import { list, get } from "@vercel/blob";

const readJson = async url => {
  const r = await get(url, { access: "private" });
  return r?.statusCode === 200 ? new Response(r.stream).json() : null;
};

export default async function handler(req, res) {
  // Header only: a key in the URL would end up in request logs and browser history.
  const key = req.headers["x-admin-key"];
  if (!process.env.ADMIN_KEY || key !== process.env.ADMIN_KEY) return res.status(401).json({ error: "wrong admin key" });

  try {
    const blobs = [];
    let cursor;
    do {
      const page = await list({ prefix: "results/", limit: 1000, cursor });
      blobs.push(...page.blobs);
      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);

    const rows = [];
    for (let i = 0; i < blobs.length; i += 25) {
      const batch = await Promise.all(blobs.slice(i, i + 25).map(b => readJson(b.url).catch(() => null)));
      rows.push(...batch.filter(Boolean));
    }

    // One row per student: keep the FIRST attempt (retakes would inflate scores).
    const first = new Map();
    for (const r of rows) {
      const k = `${r.campus}|${r.roll}`;
      if (!first.has(k) || r.at < first.get(k).at) first.set(k, { ...r, attempts: (first.get(k)?.attempts || 0) + 1 });
      else first.get(k).attempts++;
    }
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ rows: [...first.values()], totalSubmissions: rows.length });
  } catch (e) {
    console.error("summary failed", e);
    return res.status(500).json({ error: "could not load results" });
  }
}
