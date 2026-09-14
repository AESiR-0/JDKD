import type { EnquiryFormId } from "@/lib/enquiry";

/**
 * POST /api/enquiry - validates a form submission and forwards it to the
 * Google Apps Script web app (`apps-script/Code.gs`), which appends it to the
 * enquiries Sheet and optionally emails the leasing desk.
 *
 * Configuration is server-only and never reaches the browser:
 *   ENQUIRY_WEBHOOK_URL     optional; overrides DEFAULT_WEBHOOK_URL
 *   ENQUIRY_WEBHOOK_SECRET  optional; only needed if the script has a
 *                           SHARED_SECRET property, and must equal it
 */

/** The deployed JDKD Apps Script web app. */
const DEFAULT_WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbz8iI0KXmG8mdo9dj0qjhvQgn5FP3e0wZQwQ914SBR5FPSAvkCA3jxUJJMEiJZ_SwGYXw/exec";

const FORMS: readonly EnquiryFormId[] = ["walkthrough", "contact"];

const LIMITS = {
  name: 120,
  email: 200,
  phone: 40,
  company: 160,
  message: 2000,
  page: 300,
  detailKey: 40,
  detailValue: 500,
  detailCount: 12,
} as const;

/** Faster than this and it was not a person typing. */
const MIN_FILL_MS = 2000;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function line(value: unknown, max: number): string {
  return typeof value === "string"
    ? value.replace(/\s+/g, " ").trim().slice(0, max)
    : "";
}

function paragraph(value: unknown, max: number): string {
  return typeof value === "string"
    ? value.replace(/\r\n?/g, "\n").trim().slice(0, max)
    : "";
}

function formatDetails(value: unknown): string {
  if (!value || typeof value !== "object") return "";
  return Object.entries(value as Record<string, unknown>)
    .slice(0, LIMITS.detailCount)
    .map(([key, raw]) => [line(key, LIMITS.detailKey), line(raw, LIMITS.detailValue)])
    .filter(([key, text]) => key && text)
    .map(([key, text]) => `${key}: ${text}`)
    .join("; ");
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== "object") throw new Error("not an object");
    body = parsed as Record<string, unknown>;
  } catch {
    return Response.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  // Bots: the hidden field is filled, or the form was "typed" impossibly fast.
  // Answer as if it worked so they learn nothing, and store nothing.
  const elapsed = Number(body.elapsedMs);
  if (line(body.website, 200) || !Number.isFinite(elapsed) || elapsed < MIN_FILL_MS) {
    return Response.json({ ok: true });
  }

  const form = FORMS.includes(body.form as EnquiryFormId)
    ? (body.form as EnquiryFormId)
    : null;
  const enquiry = {
    form,
    name: line(body.name, LIMITS.name),
    email: line(body.email, LIMITS.email),
    phone: line(body.phone, LIMITS.phone),
    company: line(body.company, LIMITS.company),
    message: paragraph(body.message, LIMITS.message),
    details: formatDetails(body.details),
    page: line(body.page, LIMITS.page),
  };

  const phoneDigits = enquiry.phone.replace(/\D/g, "").length;
  const valid =
    form !== null &&
    enquiry.name.length > 0 &&
    (enquiry.email.length > 0 || enquiry.phone.length > 0) &&
    (enquiry.email === "" || EMAIL_PATTERN.test(enquiry.email)) &&
    (enquiry.phone === "" || (phoneDigits >= 7 && phoneDigits <= 15));
  if (!valid) {
    return Response.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const url = process.env.ENQUIRY_WEBHOOK_URL || DEFAULT_WEBHOOK_URL;
  const secret = process.env.ENQUIRY_WEBHOOK_SECRET;

  try {
    // Apps Script answers a POST with a redirect to the response body; fetch
    // follows it. Visitor details are never logged here - only failure reasons.
    const upstream = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...(secret ? { secret } : {}),
        submittedAt: new Date().toISOString(),
        ...enquiry,
      }),
      redirect: "follow",
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });

    const result = (await upstream.json().catch(() => null)) as {
      ok?: boolean;
      error?: string;
    } | null;

    if (!upstream.ok || result?.ok !== true) {
      console.error(
        "[enquiry] webhook rejected the submission:",
        upstream.status,
        result?.error ?? "non-JSON response",
      );
      return Response.json({ ok: false, error: "upstream" }, { status: 502 });
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error(
      "[enquiry] webhook unreachable:",
      error instanceof Error ? error.name : "unknown error",
    );
    return Response.json({ ok: false, error: "upstream" }, { status: 502 });
  }
}
