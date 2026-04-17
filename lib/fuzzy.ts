export function fuzzyScore(haystack: string, needle: string) {
  const h = haystack.toLowerCase();
  const n = needle.toLowerCase();
  if (!n) return { score: 0, matches: [] as number[] };

  let hi = 0;
  const matches: number[] = [];

  for (let ni = 0; ni < n.length; ni++) {
    const ch = n[ni]!;
    hi = h.indexOf(ch, hi);
    if (hi === -1) return null;
    matches.push(hi);
    hi += 1;
  }

  // Score: reward earlier + consecutive matches
  let score = 0;
  for (let i = 0; i < matches.length; i++) {
    const m = matches[i]!;
    const prev = i ? matches[i - 1]! : -999;
    const consecutive = m === prev + 1;
    score += consecutive ? 8 : 3;
    score += Math.max(0, 12 - m * 0.15);
  }

  return { score, matches };
}

export function fuzzyFilterSort<T>(items: T[], query: string, getText: (item: T) => string) {
  const q = query.trim();
  if (!q) return items;

  const scored: Array<{ item: T; score: number }> = [];
  for (const item of items) {
    const text = getText(item);
    const res = fuzzyScore(text, q);
    if (!res) continue;
    scored.push({ item, score: res.score });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.map((s) => s.item);
}

export function highlightByIndices(text: string, indices: number[]) {
  const set = new Set(indices);
  const parts: Array<{ t: string; hit: boolean }> = [];
  let buf = "";
  let hit = false;

  for (let i = 0; i < text.length; i++) {
    const h = set.has(i);
    if (i === 0) {
      hit = h;
      buf = text[i]!;
      continue;
    }
    if (h === hit) {
      buf += text[i]!;
    } else {
      parts.push({ t: buf, hit });
      buf = text[i]!;
      hit = h;
    }
  }

  if (buf) parts.push({ t: buf, hit });
  return parts;
}
