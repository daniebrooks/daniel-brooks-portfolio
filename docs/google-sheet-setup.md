# Contact form: Google Sheet and email

The contact form posts each message to a small Google Apps Script web app. The script does two things:

1. appends a row to the spreadsheet (the permanent record), and
2. emails the message to Daniel from the Google account that deploys the script, with the visitor's
   address set as Reply-To.

This needs no Resend account and no domain. Nothing secret lives in this repo.

Sheet: https://docs.google.com/spreadsheets/d/1ptn-AybmSNQXKDLXKBp6dqKgo0Re0IaDXCbh4p4jNZE

## 1. Create the script (once, about 2 minutes)

1. Open the sheet, then **Extensions > Apps Script**.
2. Replace the editor contents with the code below. Change `SECRET` to a long random string.
3. Click **Deploy > New deployment**, choose type **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**, approve the permissions (it asks for access to the sheet and to send email),
   and copy the **Web app URL** (it ends in `/exec`).

```js
// Must match GOOGLE_SHEET_SECRET in the site's environment variables.
const SECRET = "CHANGE-ME-TO-A-LONG-RANDOM-STRING";
const SHEET_ID = "1ptn-AybmSNQXKDLXKBp6dqKgo0Re0IaDXCbh4p4jNZE";
const NOTIFY_TO = "daniel.brooks.ashburn@gmail.com";
const HEADERS = ["Received", "Name", "Email", "Phone Number", "Subject", "Message"];

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    if (data.secret !== SECRET) return reply({ ok: false, error: "forbidden" });

    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
    if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
    sheet.appendRow([new Date(), data.name, data.email, data.phone, data.subject, data.message]);

    // The row is already saved, so a failed email (for example the daily quota) must not fail the request.
    try {
      MailApp.sendEmail({
        to: NOTIFY_TO,
        replyTo: data.email,
        subject: "Portfolio: " + data.subject,
        body:
          "Name: " + data.name + "\nEmail: " + data.email + "\nPhone: " + data.phone +
          "\nSubject: " + data.subject + "\n\n" + data.message,
      });
    } catch (mailErr) {}

    return reply({ ok: true });
  } catch (err) {
    return reply({ ok: false, error: "failed" });
  }
}

function reply(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
```

If the sheet already has its own header row, delete the `HEADERS` line and the `if (...) appendRow(HEADERS)`
line, and make sure the columns in `appendRow([...])` match your headers.

Limits: Google allows about 100 emails per day on a normal account (1,500 on Workspace). That is plenty
for a portfolio, and every message is saved in the sheet regardless.

## 2. Tell the site where the script is

In Vercel (Project > Settings > Environment Variables), add:

| Name | Value |
|---|---|
| `GOOGLE_SHEET_WEBHOOK_URL` | the Web app URL from step 1 |
| `GOOGLE_SHEET_SECRET` | the same string you put in `SECRET` |

Redeploy, then send one real message from the live site and check that a row appears and the email arrives.

## Optional: Resend instead of (or as well as) the script's email

If `RESEND_API_KEY` is set, the site also emails through Resend. Resend's free test sender
(`onboarding@resend.dev`) can only deliver to the email address that owns the Resend account. To deliver
to Daniel's Gmail from a Resend account owned by someone else, verify a domain in Resend and set
`CONTACT_FROM_EMAIL` to an address on it. The form reports success if either path worked.
