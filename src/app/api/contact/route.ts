import { profile } from "@/components/sites/sweandrew/data";

const MAX = { name: 100, email: 254, phone: 30, subject: 150, message: 4000 };
const MIN_MESSAGE = 10;
const WINDOW_MS = 60 * 60 * 1000;
const LIMIT = 5; // messages per IP per hour

// In-memory limiter: per serverless instance, so it's a speed bump rather than a hard guarantee.
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  // Evict keys with no hit in the window so the map cannot grow without bound.
  for (const [key, times] of hits) if (now - times[times.length - 1] >= WINDOW_MS) hits.delete(key);
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= LIMIT) {
    hits.set(ip, recent);
    return true;
  }
  hits.set(ip, [...recent, now]);
  return false;
}

// Strip control characters (blocks header injection) and collapse to a single line.
const oneLine = (v: unknown, max: number) =>
  typeof v === "string" ? v.replace(/[\u0000-\u001f\u007f]+/g, " ").trim().slice(0, max) : "";
// Keep line breaks in the message body, drop other control characters.
const multiLine = (v: unknown, max: number) =>
  typeof v === "string"
    ? v.replace(/\r/g, "").replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, "").trim().slice(0, max)
    : "";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_CHARS = /^[+0-9 ()\-.]+$/;
const validPhone = (p: string) => {
  const digits = p.replace(/\D/g, "").length;
  return PHONE_CHARS.test(p) && digits >= 7 && digits <= 15;
};

// A spreadsheet treats text starting with = + - @ as a formula. Prefix those so a visitor can't run one.
const safeCell = (s: string) => (/^[=+\-@]/.test(s) ? `'${s}` : s);

type Entry = { name: string; email: string; phone: string; subject: string; message: string };

// Each delivery returns true (sent), false (failed) or null (not configured).
async function saveToSheet(entry: Entry): Promise<boolean | null> {
  const url = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  if (!url) return null;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: process.env.GOOGLE_SHEET_SECRET ?? "",
        name: safeCell(entry.name),
        email: safeCell(entry.email),
        phone: safeCell(entry.phone),
        subject: safeCell(entry.subject),
        message: safeCell(entry.message),
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return false;
    const data: { ok?: boolean } | null = await res.json().catch(() => null);
    return data?.ok === true;
  } catch {
    return false;
  }
}

async function sendEmail(entry: Entry): Promise<boolean | null> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>",
        to: [process.env.CONTACT_TO_EMAIL || profile.contact.email],
        reply_to: entry.email,
        subject: `Portfolio: ${entry.subject}`,
        text: `Name: ${entry.name}\nEmail: ${entry.email}\nPhone: ${entry.phone}\nSubject: ${entry.subject}\n\n${entry.message}`,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

const json = (body: Record<string, unknown>, status: number) => Response.json(body, { status });

export async function POST(request: Request) {
  // Browsers always send Origin on cross-site POSTs; reject ones that aren't from this site.
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (origin && host && new URL(origin).host !== host) return json({ error: "forbidden" }, 403);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid" }, 400);
  }

  // Honeypot: real visitors never fill this hidden field. Pretend success so bots learn nothing.
  if (typeof body.company === "string" && body.company.trim() !== "") return json({ ok: true }, 200);

  const entry: Entry = {
    name: oneLine(body.name, MAX.name),
    email: oneLine(body.email, MAX.email),
    phone: oneLine(body.phone, MAX.phone),
    subject: oneLine(body.subject, MAX.subject),
    message: multiLine(body.message, MAX.message),
  };
  if (
    !entry.name ||
    !EMAIL.test(entry.email) ||
    !validPhone(entry.phone) ||
    !entry.subject ||
    entry.message.length < MIN_MESSAGE
  ) {
    return json({ error: "invalid" }, 400);
  }

  // The platform sets x-real-ip; otherwise take the right-most x-forwarded-for entry (the one our own
  // proxy appended), never the left-most, which the client controls.
  const ip =
    request.headers.get("x-real-ip")?.trim() ||
    (request.headers.get("x-forwarded-for") ?? "").split(",").at(-1)?.trim() ||
    "unknown";
  if (rateLimited(ip)) return json({ error: "rate_limited" }, 429);

  // Save to the sheet and email Daniel at the same time. The visitor sees success if either worked,
  // so one provider being down never loses a message that the other one stored.
  const [sheet, email] = await Promise.all([saveToSheet(entry), sendEmail(entry)]);
  if (sheet === null && email === null) return json({ error: "not_configured" }, 503);
  if (sheet === true || email === true) return json({ ok: true }, 200);
  return json({ error: "send_failed" }, 502);
}
