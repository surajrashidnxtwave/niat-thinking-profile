import { put } from "@vercel/blob";

const slug = s => String(s || "").toUpperCase().replace(/[^A-Z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "UNKNOWN";
const num = (v, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, Math.round(Number(v) || 0)));

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  const b = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
  if (!b.name || !b.roll) return res.status(400).json({ error: "name and roll are required" });

  const row = {
    name: String(b.name).slice(0, 80),
    roll: String(b.roll).toUpperCase().slice(0, 40),
    campus: String(b.campus || "MAIN").toUpperCase().trim().slice(0, 80),
    reliance: num(b.reliance), said: num(b.said), thinking: num(b.thinking),
    skills: { creativity: num(b.skills?.creativity), insight: num(b.skills?.insight), reading: num(b.skills?.reading), focus: num(b.skills?.focus), selfaware: num(b.skills?.selfaware), reasoning: num(b.skills?.reasoning) },
    know: { right: num(b.know?.right, 0, 5), overconfident: num(b.know?.overconfident, 0, 5) },
    profile: ["power", "offloader", "independent", "developing"].includes(b.profile) ? b.profile : "developing",
    ai: { asks: num(b.ai?.asks, 0, 6), quickAsks: num(b.ai?.quickAsks, 0, 6), followedWrong: num(b.ai?.followedWrong, 0, 3), droppedRight: num(b.ai?.droppedRight, 0, 6) },
    dat: { kept: Array.isArray(b.dat?.kept) ? b.dat.kept.slice(0, 7).map(w => String(w).slice(0, 30)) : [], method: String(b.dat?.method || "").slice(0, 10) },
    tabs: num(b.tabs, 0, 999), minutes: num(b.minutes, 0, 600),
    reflect: String(b.reflect || "").slice(0, 500),
    at: Date.now()
  };

  try {
    await put(`results/${slug(row.campus)}/${slug(row.roll)}.json`, JSON.stringify(row), {
      access: "public", addRandomSuffix: true, contentType: "application/json"
    });
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("submit failed", e);
    return res.status(500).json({ error: "could not save" });
  }
}
