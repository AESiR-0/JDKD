/**
 * JDKD enquiry intake - Google Apps Script web app.
 *
 * The website never talks to this script from the browser. Its own route,
 * `/api/enquiry`, validates each submission and forwards it here with a shared
 * secret, so the web app URL and the secret stay server-side.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * SETUP (once)
 *
 *  1. Create a Google Sheet for enquiries and copy its URL.
 *  2. Open https://script.google.com → New project (or, in the Sheet,
 *     Extensions → Apps Script). Replace the contents of Code.gs with this file.
 *  3. Project Settings (gear icon) → Script properties → add:
 *       SHEET_URL      The Sheet URL from step 1.
 *       SHARED_SECRET  A long random string (32+ characters). The site's
 *                      ENQUIRY_WEBHOOK_SECRET must be exactly the same value.
 *       NOTIFY_EMAIL   Optional. Comma-separated addresses that get an email
 *                      for every enquiry.
 *       SHEET_NAME     Optional. Tab to write to. Defaults to "Enquiries".
 *  4. In the editor, choose `setup` in the function dropdown and Run it once.
 *     Accept the permissions prompt. It creates the tab and its header row.
 *  5. Deploy → New deployment → Select type: Web app.
 *       Execute as:     Me
 *       Who has access: Anyone
 *     Deploy, then copy the Web app URL (it ends in /exec).
 *  6. In Vercel → Project → Settings → Environment Variables (Production):
 *       ENQUIRY_WEBHOOK_URL     the /exec URL from step 5
 *       ENQUIRY_WEBHOOK_SECRET  the SHARED_SECRET from step 3
 *     Then redeploy the site.
 *
 * "Anyone" access is required because the website calls this as a server, not
 * as a signed-in Google user. SHARED_SECRET is what keeps everyone else out.
 *
 * AFTER EDITING THIS SCRIPT: Deploy → Manage deployments → Edit (pencil) →
 * Version: New version → Deploy. The /exec URL does not change.
 *
 * HEALTH CHECK: opening the /exec URL in a browser returns
 * {"ok":true,"service":"jdkd-enquiry"}.
 */

const HEADERS = [
  "Submitted at",
  "Form",
  "Name",
  "Email",
  "Phone",
  "Company",
  "Message",
  "Details",
  "Page",
];

const MAX_CELL = 5000;

function doPost(e) {
  try {
    const props = PropertiesService.getScriptProperties();
    const secret = props.getProperty("SHARED_SECRET");
    if (!secret) return json_({ ok: false, error: "not_configured" });

    const body = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    if (!safeEqual_(String(body.secret || ""), secret)) {
      return json_({ ok: false, error: "unauthorized" });
    }

    const submittedAt = body.submittedAt ? new Date(body.submittedAt) : new Date();
    const row = [
      isNaN(submittedAt.getTime()) ? new Date() : submittedAt,
      sanitize_(body.form),
      sanitize_(body.name),
      sanitize_(body.email),
      sanitize_(body.phone),
      sanitize_(body.company),
      sanitize_(body.message),
      sanitize_(body.details),
      sanitize_(body.page),
    ];

    // Two enquiries landing at once must not overwrite each other's row.
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      getSheet_().appendRow(row);
    } finally {
      lock.releaseLock();
    }

    // The row is already saved; a mail failure must not report the enquiry lost.
    try {
      notify_(props.getProperty("NOTIFY_EMAIL"), body);
    } catch (mailError) {
      console.error("notify failed: " + mailError);
    }

    return json_({ ok: true });
  } catch (error) {
    console.error("doPost failed: " + error);
    return json_({ ok: false, error: "server_error" });
  }
}

function doGet() {
  return json_({ ok: true, service: "jdkd-enquiry" });
}

/** Run once from the editor: creates the tab + headers and triggers the permission prompt. */
function setup() {
  const sheet = getSheet_();
  if (PropertiesService.getScriptProperties().getProperty("NOTIFY_EMAIL")) {
    MailApp.getRemainingDailyQuota();
  }
  console.log("Ready. Writing to: " + sheet.getParent().getUrl() + " → " + sheet.getName());
}

function getSheet_() {
  const props = PropertiesService.getScriptProperties();
  const url = props.getProperty("SHEET_URL");
  const spreadsheet = url
    ? SpreadsheetApp.openByUrl(url)
    : SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) {
    throw new Error("Set the SHEET_URL script property (Project Settings → Script properties).");
  }

  const name = props.getProperty("SHEET_NAME") || "Enquiries";
  const sheet = spreadsheet.getSheetByName(name) || spreadsheet.insertSheet(name);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
  }
  return sheet;
}

/**
 * Everything a visitor typed goes through here. A value starting with = + - @
 * would otherwise run as a formula when the sheet is opened (formula injection),
 * so it is prefixed with an apostrophe and stored as plain text.
 */
function sanitize_(value) {
  const text = value == null ? "" : String(value).slice(0, MAX_CELL);
  return /^[=+\-@\t\r]/.test(text) ? "'" + text : text;
}

function safeEqual_(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function notify_(recipients, body) {
  if (!recipients) return;

  const lines = [
    "New enquiry from the JDKD website",
    "",
    "Form:    " + (body.form || "-"),
    "Name:    " + (body.name || "-"),
    "Email:   " + (body.email || "-"),
    "Phone:   " + (body.phone || "-"),
    "Company: " + (body.company || "-"),
    "",
    "Message:",
    body.message || "-",
  ];
  if (body.details) lines.push("", "Details: " + body.details);
  lines.push("", "Page: " + (body.page || "-"));

  const options = {
    to: recipients,
    subject: "New enquiry - " + (body.name || "Website visitor"),
    body: lines.join("\n"),
  };
  if (body.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(body.email))) {
    options.replyTo = String(body.email);
  }
  MailApp.sendEmail(options);
}

function json_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
