/**
 * JDKD enquiry intake - Google Apps Script web app.
 *
 * The website never talks to this script from the browser. Its own route,
 * `/api/enquiry`, validates each submission and forwards it here, so the web
 * app URL stays server-side.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * SETUP (once)
 *
 *  1. Open the script project and replace the contents of Code.gs with this file.
 *  2. In the editor, choose `setup` in the function dropdown and Run it once.
 *     Accept the permissions prompt. It creates the tab and its header row.
 *  3. Deploy → New deployment → Select type: Web app.
 *       Execute as:     Me
 *       Who has access: Anyone
 *
 * Script properties are all OPTIONAL (Project Settings → Script properties):
 *   SHEET_URL      Overrides DEFAULT_SHEET_URL below.
 *   SHARED_SECRET  When set, requests must carry the same value; set the site's
 *                  ENQUIRY_WEBHOOK_SECRET to match. Unset = no secret check.
 *   NOTIFY_EMAIL   Comma-separated addresses that get an email per enquiry.
 *   SHEET_NAME     Tab to write to. Defaults to "Enquiries".
 *
 * "Anyone" access is required because the website calls this as a server, not
 * as a signed-in Google user. Without SHARED_SECRET, anyone who learns the
 * /exec URL can add rows, so keep that URL out of the browser.
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

/** The JDKD enquiries Sheet. The SHEET_URL script property overrides it. */
const DEFAULT_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1_4CqXOyBmF9bCgaRl1aOZQBGwNj97VRduFsdPR--nNo/edit";

function doPost(e) {
  try {
    const props = PropertiesService.getScriptProperties();
    const secret = props.getProperty("SHARED_SECRET");

    const body = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    if (secret && !safeEqual_(String(body.secret || ""), secret)) {
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
  const spreadsheet = SpreadsheetApp.openByUrl(
    props.getProperty("SHEET_URL") || DEFAULT_SHEET_URL,
  );

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
