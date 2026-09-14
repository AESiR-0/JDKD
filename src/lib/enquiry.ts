/**
 * Client side of the enquiry pipeline. Both forms post through `submitEnquiry`
 * to `/api/enquiry`, which validates and forwards to the Google Apps Script web
 * app (`apps-script/Code.gs`). Nothing here knows the script URL or secret.
 */

export const ENQUIRY_ENDPOINT = "/api/enquiry";

/** Name of the hidden spam-trap field. Humans never see or fill it. */
export const HONEYPOT_FIELD = "website";

export type EnquiryFormId = "walkthrough" | "contact";

export type EnquiryInput = {
  readonly form: EnquiryFormId;
  readonly name: string;
  readonly email?: string;
  readonly phone?: string;
  readonly company?: string;
  readonly message?: string;
  /** Any extra fields, stored in the sheet's "Details" column. */
  readonly details?: Readonly<Record<string, string>>;
  /** The honeypot's value - always "" from a real visitor. */
  readonly website: string;
  /** Milliseconds between the form mounting and submit. */
  readonly elapsedMs: number;
  readonly page: string;
};

export type EnquiryError =
  | "invalid"
  | "not_configured"
  | "upstream"
  | "network";

export type EnquiryResult =
  | { readonly ok: true }
  | { readonly ok: false; readonly error: EnquiryError };

export async function submitEnquiry(
  input: EnquiryInput,
): Promise<EnquiryResult> {
  try {
    const response = await fetch(ENQUIRY_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = (await response.json().catch(() => null)) as {
      ok?: boolean;
      error?: EnquiryError;
    } | null;

    if (response.ok && data?.ok) return { ok: true };
    return { ok: false, error: data?.error ?? "upstream" };
  } catch {
    return { ok: false, error: "network" };
  }
}
