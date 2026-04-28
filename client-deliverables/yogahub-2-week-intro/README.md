# YogaHub – 2-Week Intro Offer Post Opt-In Email Sequence

A 4-email post opt-in sequence designed to convert leads into 2-week intro pass purchasers. Built as HTML email templates ready to paste into GoHighLevel (GHL).

## Sequence Overview

| # | Email | Send Delay | Goal |
|---|-------|------------|------|
| 1 | Welcome + Deliver | Immediate (0 min) | Confirm opt-in, deliver offer, drive first checkout click |
| 2 | What to Expect | 1 day | Reinforce value, paint outcome, second CTA |
| 3 | Objection Handling + Social Proof | 3 days | Address "I'm not flexible / I'm a beginner" objections |
| 4 | Last Chance | 5 days | Urgency, final push to checkout |

## Folder Structure

```
yogahub-2-week-intro/
├── meta-ads/         # Drop into the workflow triggered by the Meta opt-in form
│   ├── 01-welcome.html
│   ├── 02-benefits.html
│   ├── 03-objections.html
│   └── 04-urgency.html
└── google-ads/       # Drop into the workflow triggered by the Google opt-in form
    ├── 01-welcome.html
    ├── 02-benefits.html
    ├── 03-objections.html
    └── 04-urgency.html
```

The only difference between the two folders is the checkout URL custom value:

- **Meta ads** → `{{custom_values.checkout_url}}`
- **Google ads** → `{{custom_values.checkout_url_google__yoga_2_weeks}}`

The body copy, design, and structure are identical.

## Custom Values Used

| Custom Value | Where Used |
|--------------|------------|
| `{{custom_values.logo}}` | Header image (all emails) |
| `{{custom_values.checkout_url}}` | All CTA buttons + text links (Meta version) |
| `{{custom_values.checkout_url_google__yoga_2_weeks}}` | All CTA buttons + text links (Google version) |

Make sure these custom values are populated in **Settings → Custom Values** in your GHL sub-account before launching.

## Subject Lines + Preheaders

**Email 1 – Welcome**
- Subject: `Welcome! Your 2-week intro to YogaHub is ready`
- Preheader: `Tap below to claim your spot — see you on the mat soon.`

**Email 2 – What to Expect**
- Subject: `Here's what 2 weeks at YogaHub can actually do`
- Preheader: `Stronger body. Calmer mind. Better sleep. Yes, in 14 days.`

**Email 3 – Objections**
- Subject: `"I'm not flexible enough for yoga"`
- Preheader: `Spoiler: that's exactly why yoga is for you.`

**Email 4 – Last Chance**
- Subject: `Last call: your 2-week intro is waiting`
- Preheader: `Don't let this one slip — we'd love to see you on the mat.`

## How to Add to GHL

1. In your GHL sub-account, go to **Marketing → Emails → Templates**
2. Click **+ New** → **Builder** → switch to the **Code Editor / HTML** view (top-right toggle in the email builder)
3. Paste the full HTML from the relevant file
4. Save as a template (e.g. `Yoga 2-Week Intro – Email 1 – Welcome – Meta`)
5. In your post opt-in **Workflow**, add a **Send Email** action and select the template
6. Set the **Wait** steps between emails per the timing table above

## Design Notes

- 600px max width, single-column, mobile-responsive
- Table-based layout with inline CSS for max email-client compatibility (Gmail, Outlook, Apple Mail, Yahoo)
- Calm sage-green CTA buttons (`#6b8e6b`) with rounded corners
- System font stack — no web fonts (Outlook breaks them)
- Light cream background (`#faf7f2`) with white email card for premium feel
- Logo height capped at 60px

## Editing in GHL

If you want to swap copy, you can either:
1. Edit the HTML directly in the Code Editor view
2. Save the template, then open it in the visual builder and edit the text blocks (note: heavy visual edits can sometimes alter the inlined CSS — keep a backup of the original HTML)

## QA Checklist Before Going Live

- [ ] Custom value `{{custom_values.logo}}` is populated and points to a hosted logo image (PNG/SVG, transparent background ideal, ~300px wide)
- [ ] Custom value `{{custom_values.checkout_url}}` is set in the sub-account
- [ ] Custom value `{{custom_values.checkout_url_google__yoga_2_weeks}}` is set in the sub-account
- [ ] Send a test email to yourself from the GHL builder for each email
- [ ] Click every CTA in the test email and confirm it goes to the correct checkout
- [ ] Open the test on mobile (iOS Mail + Gmail app) and desktop
- [ ] Confirm sender name + reply-to address are set on the workflow
- [ ] Confirm timing/wait steps between emails
- [ ] Add the lead to a test contact and run a live workflow trigger
