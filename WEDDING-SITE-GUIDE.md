# Wedding Invitation Website: Complete Setup Guide
**Nicole & Hanes · January 10, 2027**

This guide explains how the website is built, how every file works, how to change things, how to collect RSVPs in a Google Sheet, and how to put it online for free.

**Contents**
1. [What you have](#1-what-you-have)
2. [How it all works](#2-how-it-all-works)
3. [Quick start on your computer](#3-quick-start-on-your-computer)
4. [Your details: config.js](#4-your-details-configjs)
5. [Text and sections: index.html](#5-text-and-sections-indexhtml)
6. [Colors and fonts: style.css](#6-colors-and-fonts-stylecss)
7. [Pictures: the assets folder](#7-pictures-the-assets-folder)
8. [RSVP answers in a Google Sheet](#8-rsvp-answers-in-a-google-sheet)
9. [Put it online (Cloudflare Pages)](#9-put-it-online-cloudflare-pages)
10. [Checklist before you send it](#10-checklist-before-you-send-it)
11. [Troubleshooting](#11-troubleshooting)
12. [Limits and privacy](#12-limits-and-privacy)
13. [Cheat sheet: "I want to change ___"](#13-cheat-sheet-i-want-to-change-)

---

## 1. What you have

```
wedding-rsvp/
├── index.html       The PAGE: every section of the invitation, in order
├── style.css        The LOOK: colors, fonts, spacing, animations
├── config.js        YOUR DETAILS: names, date, venues, map links, entourage. You edit this most.
├── script.js        The BEHAVIOR: intro, countdown, QR codes, RSVP form. Rarely edited.
└── assets/
    ├── emboss.png       embossed flowers (opening page + first page)
    ├── ceremony.jpg     church sketch (Venues)
    ├── reception.jpg    Catalina logo (Venues)
    ├── favicon.svg      the small icon in the browser tab
    ├── photo.jpg        (YOU ADD) couple photo for the countdown section
    └── attire-*.png     (OPTIONAL) your own outfit pictures
```

This is a **static website**: plain files with no database, no server, and nothing to install. That is why it can be hosted for free.

**Golden rule:** always keep these files together, in this structure. If you upload the site, upload **everything**, not only `index.html`.

---

## 2. How it all works

**When a guest opens your link**

1. The browser downloads `index.html`.
2. `index.html` asks for:
   - `style.css` (the look)
   - fonts from Google Fonts
   - `config.js` (your details)
   - `script.js` (the behavior)
   - the pictures in `assets/`
3. `script.js` reads `config.js` and **fills in the text**: names, dates, venue names, FAQ answers, the countdown, and the map buttons. You change a detail **once** in `config.js` and it updates everywhere.
4. The guest sees the **envelope intro**. Tapping it fades into the invitation.
5. Sections fade in as the guest scrolls.
6. **Venues:** each card has a QR code and an "Open in Google Maps" button for the map link you set.
7. **RSVP:** the guest taps "Click here to RSVP", fills the form, and sends it. The form posts to your **Google Apps Script link**, which adds a row to your **Google Sheet**.

```
 Guest's phone ──► Cloudflare Pages ──► page + pictures (hosting only)
        │
        └── RSVP form ──► Google Apps Script ──► your Google Sheet (the answers)
```

Cloudflare never sees or stores RSVPs. They go straight to your Google Sheet.

---

## 3. Quick start on your computer

1. Unzip `wedding-rsvp.zip` into a folder (for example on your Desktop). When you open the folder you must see `index.html` right away, not another folder.
2. Open **VS Code**, then **File → Open Folder** and choose it.
3. Install the **Live Server** extension (the square icon in the left bar, or `Ctrl+Shift+X`).
4. Right-click `index.html` and choose **Open with Live Server**. The page opens in your browser and refreshes every time you save.

**Preview on your phone (same Wi-Fi as your PC)**
1. On your PC press `Win+R`, type `cmd`, press Enter, type `ipconfig`, and note the **IPv4 Address** (for example `192.168.100.105`).
2. On your phone's browser open `http://YOUR-IP:5500`, for example `http://192.168.100.105:5500`.
3. If it doesn't load, allow VS Code on **Private networks** when Windows Firewall asks, and make sure the Wi-Fi network is set to **Private**.

---

## 4. Your details: config.js

Open `config.js`. Change only the text between the quotes. Keep the quotes, commas, and brackets.

| Setting | What it controls | Example |
|---|---|---|
| `weddingDate` | The countdown, the big "01 10 27", the date line, and the "2:30 in the afternoon" line | `"2027-01-10T14:30:00+08:00"` (format `YYYY-MM-DDTHH:MM:SS+08:00`) |
| `bride`, `groom` | Names used across the whole page | `"Nicole"`, `"Hanes"` |
| `city` | The line at the bottom of the first page | `"San Jose del Monte, Bulacan"` |
| `arrivalTime` | The arrival time in the FAQs | `"1:00 PM"` |
| `ceremonyTime` | The ceremony time in the FAQs | `"2:30 PM"` |
| `ceremony` / `reception` | Venue `name`, `address`, and `map` link (name and address show on the venue cards) | see the file |
| `rsvpDeadline` | The reply deadline shown in the RSVP section and FAQs | `"December 15, 2026"` |
| `contacts` | Names and phone numbers in the FAQ "How can I RSVP?" | `{ name: "Nicole", phone: "+63 9XX XXX XXXX" }` |
| `scriptUrl` | Your Google Apps Script link (section 8) | `"https://script.google.com/macros/s/.../exec"` |
| `fallbackEmail` | Used only if `scriptUrl` is empty: the form opens the guest's email app | `"yourname@gmail.com"` |
| `accessCode` | Optional. If set, guests must type this code before the form appears | `"love2027"` or `""` for none |

**Important:** `weddingDate` and `ceremonyTime` are separate settings. If the ceremony time changes, update **both** so the invitation, the countdown, and the FAQs agree.

**Map links:** paste a Google Maps share link. The QR codes for your two current links are already built into the page. If you change a link, the QR code redraws automatically (the guest's phone needs internet). If the map link is left empty (`""`), the button searches Google Maps by the venue name and address.

**Entourage:** the `ENTOURAGE` section lists parents, sponsors, best men, bridesmaids, and bearers. Replace each `"Full Name"` with a real name. To add someone, copy a line inside the same list and keep the comma. By default the left column is the groom's side and the right column is the bride's side. Principal sponsors are pairs: `["Mr. Name", "Mrs. Name"]`.

**If the page goes blank after you edit `config.js`**, a quote or comma is probably missing. Press `F12` in the browser, open the **Console** tab, and read the red message. It names the line.

---

## 5. Text and sections: index.html

Press `Ctrl+F` in VS Code to find any text. Each section is a block that starts with `<section ... id="NAME">` and ends with `</section>`.

| Section id | What it is |
|---|---|
| `save` | The big "01 10 27" page |
| `invite` | Monogram, names, date, venues |
| `entourage` | The entourage list (names come from `config.js`) |
| `countdownSec` | Couple photo and countdown |
| `venues` | Ceremony and reception cards with pictures and QR codes |
| `gift` | Gift guide message |
| `attire` | Attire guide: outfit pictures and color dots |
| `faqs` | The questions and answers |
| `rsvp` | The Kindly RSVP form |

Above these is the **intro** (the envelope), and below them is the footer.

**Things you should review and edit**
- **FAQs:** the answers about plus ones, kids, photos, and "until what time is the program" (9:00 PM) are samples. Rewrite them to match your plans.
- **Gift guide:** the wording is general. Add your own message.
- **Attire guide:** the wording and the colored dots under each group are samples. The dots look like `<span style="background:#1D3A2C"></span>`. Change the color code to change a dot.

**Remove a section**
1. Select the whole block from `<section ...>` to `</section>` and delete it.
2. Save and check the page. The script skips anything that is missing, so the rest keeps working.

**Reorder sections**
Cut a whole section block and paste it somewhere else between two other sections.

**Outfit pictures:** the figures in the attire guide are drawn in code. Their colors are in `script.js` in the list named `FIGS`. To use your own pictures instead, see section 7.

---

## 6. Colors and fonts: style.css

At the very top of `style.css` is a `:root { ... }` block with the colors. Change a color there once and it changes everywhere.

| Variable | Meaning |
|---|---|
| `--champ` | Champagne background (`#E6D8BD`) |
| `--choc` | Chocolate brown background (`#452C1F`) |
| `--cocoa` | Dark text on champagne |
| `--cream` | Light text on chocolate |
| `--display`, `--body`, `--script` | The three fonts (headings, text, and the handwritten look) |

Each section is either **chocolate** or **champagne**. In the HTML this is the class on the `<section>`: `light` means chocolate and `dark` means champagne. (The names are left over from the original green and white design.) Change the class to swap a section's color.

---

## 7. Pictures: the assets folder

| File | Used for | Tips |
|---|---|---|
| `assets/photo.jpg` | Couple photo in the oval (countdown section) | **You add this.** Portrait, about 900×1200 pixels, under 200 KB. Until it exists, the page shows an "N & H" placeholder. |
| `assets/ceremony.jpg` | Ceremony card picture | About 900 pixels wide, under 150 KB |
| `assets/reception.jpg` | Reception card picture | Same |
| `assets/emboss.png` | The embossed flowers | Leave as is |
| `assets/favicon.svg` | Browser tab icon | Leave as is |
| `assets/attire-sponsors.png`, `attire-entourage.png`, `attire-guests.png` | **Optional.** If these files exist, they replace the drawn outfit figures | Any width up to about 900 pixels |

To replace a picture, put your new file in `assets/` with the **same file name**. Make large photos smaller first, for free, at **squoosh.app**. Phones on mobile data load the page faster when pictures are small.

If a picture file is missing, the page shows a simple placeholder instead of breaking.

---

## 8. RSVP answers in a Google Sheet

### Create the sheet and script
1. Go to **sheets.google.com** and create a blank sheet named **Wedding RSVP**.
2. In row 1, type these headers in separate cells: `Timestamp | Name | Attending | Guests | Meal | Diet | Note`
3. Click **Extensions → Apps Script**.
4. Delete the sample code and paste this:

```javascript
const SHEET_ID = "PASTE_YOUR_SHEET_ID_HERE";   // from the sheet's address: .../spreadsheets/d/THIS-PART/edit

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
    const p = e.parameter;
    sheet.appendRow([new Date(), p.name || "", p.attending || "", p.guests || "", p.meal || "", p.diet || "", p.note || ""]);
    return ContentService.createTextOutput("ok");
  } catch (err) {
    return ContentService.createTextOutput("error: " + err);
  }
}

function doGet() {
  return ContentService.createTextOutput("RSVP script is running");
}
```

5. Replace `PASTE_YOUR_SHEET_ID_HERE` with the long ID from your sheet's address bar, then save.

### Publish it
1. Click **Deploy → New deployment**.
2. Click the gear icon, choose **Web app**, and set **Execute as: Me** and **Who has access: Anyone**. It must say "Anyone", not "Anyone with Google account".
3. Click **Deploy** and approve the permissions. If Google warns that the app isn't verified, click **Advanced → Go to (project name) → Allow**. It is your own script, so this is normal.
4. Copy the **Web app URL**. It must start with `https://script.google.com/macros/s/` and end with `/exec`.

### Connect it
1. Open `config.js` and paste the link: `scriptUrl: "https://script.google.com/macros/s/.../exec",`
2. Save, then **upload the site again** (section 9).

### Test it
1. Open your live site in a private window and submit a test RSVP.
2. A new row should appear in the sheet within a few seconds.
3. Delete the test row.
4. If nothing appears, open **Executions** in Apps Script: "Completed" means Google received it, "Failed" shows the error.

**If you ever change the script code:** go to **Deploy → Manage deployments → pencil icon → Version: New version → Deploy**. Saving alone is not enough.

**Good to know**
- The form tells guests "Thank you" even if the save failed, because the browser can't read Google's answer. That is why you must test it.
- Keep the sheet's own sharing link private. Only the web app link goes in the page.
- Set up emails for new answers in the sheet under **Tools → Notification settings**.
- Download a backup after the deadline: **File → Download → Excel**.

---

## 9. Put it online (Cloudflare Pages)

### First upload
1. Sign up free at **cloudflare.com** and verify your email.
2. In the dashboard open **Workers & Pages** and choose **Create application → Pages → Upload your assets** (it may say "Direct upload" or "Drag and drop"). Cloudflare's screens change from time to time, so look for the upload option.
3. Type a **project name**. Your link becomes `PROJECT-NAME.pages.dev`.
4. Upload either:
   - **the zip file** (`wedding-rsvp.zip`), or
   - **the whole folder**, with `index.html` directly inside it.
5. Click **Deploy site**. When it shows success, open `https://PROJECT-NAME.pages.dev` (the main link, not the long one with random letters).

### Check that every file arrived
Open these in your browser. Each should show something, not an error:
- `https://PROJECT-NAME.pages.dev/style.css` shows text
- `https://PROJECT-NAME.pages.dev/assets/ceremony.jpg` shows the church picture

If one fails, that file was not uploaded. Upload the complete folder again.

### Update the site later
1. Edit and save in VS Code and check it with Live Server.
2. In Cloudflare open **Workers & Pages → your project → Create deployment**.
3. Upload the folder (or zip) again and click **Deploy**.
4. Open your link in a private window and press `Ctrl+Shift+R` so the browser doesn't show an old copy.

### If you see a Cloudflare Access login page
That means the link is protected. Make sure you use the main `pages.dev` link, and check **Settings → Preview access** in your project. In **Zero Trust → Applications**, delete any Access application attached to the project.

### Other free hosts
Netlify Drop (app.netlify.com/drop) and GitHub Pages also work with this same folder. Netlify's free plan counts a few credits for each deployment, so edit and preview on your computer first and deploy only when you're ready.

---

## 10. Checklist before you send it

- [ ] `config.js`: names, date and time, venues, map links, deadline, contacts
- [ ] `weddingDate` and `ceremonyTime` match
- [ ] Entourage names are all real (no "Full Name" left)
- [ ] `assets/photo.jpg` added
- [ ] FAQs, gift guide, and attire text match your actual plans
- [ ] `scriptUrl` filled in and a **test RSVP appears in the Google Sheet** (then delete it)
- [ ] Opened the live link on your phone **on mobile data**, in a private tab
- [ ] Tapped the envelope, scrolled the whole page, and opened both map buttons
- [ ] Scanned a QR code from a second screen to check it opens the right place
- [ ] Reload test: `https://YOUR-SITE/assets/ceremony.jpg` and `/style.css` both load
- [ ] Kept a backup copy of the whole folder

---

## 11. Troubleshooting

| Problem | Likely cause and fix |
|---|---|
| Venue pictures show simple line drawings | `assets/ceremony.jpg` or `reception.jpg` didn't upload. Upload the complete folder again and check the picture links in section 9. |
| Page has no colors or styling | `style.css` is missing or not next to `index.html`. |
| Page is blank, or stuck on the envelope | A typo in `config.js` (missing quote or comma). Press `F12` and read the red message in the Console. |
| RSVP says thank you but nothing is in the Sheet | `scriptUrl` empty or wrong, access not set to **Anyone**, no **New version** deployed, or the site wasn't uploaded again after editing. See section 8 and check **Executions**. |
| Cloudflare shows a login page | Cloudflare Access is on. See the "Access login page" part of section 9. |
| 404 error on the main link | `index.html` is inside a subfolder in the upload. It must be at the top level. |
| Changes don't show online | You must upload again after editing. Then hard refresh with `Ctrl+Shift+R`. |
| Phone can't open the Live Server link | Same Wi-Fi? Windows Firewall set to allow Private networks? PC network profile set to **Private**? |
| Countdown shows 00 : 00 : 00 : 00 | `weddingDate` is in the past or in the wrong format. |
| QR code missing | Pictures and QR codes for the current links are built in. A QR for a **new** map link needs internet. The map button always works. |

---

## 12. Limits and privacy

- **Free hosting:** Cloudflare Pages' free plan has no bandwidth charge for static pages. A wedding page uses a tiny fraction of its limits. Plans can change, so check the pricing page at pages.cloudflare.com if you are concerned.
- **Google Apps Script:** has daily limits, but a wedding's worth of RSVPs is far below them.
- **Not private, only unlisted:** anyone who has your link can open the page. The page includes a "do not index" tag so search engines are asked to skip it, but that is a request and not a lock. Don't put a home address or other private information on the page.
- **Entourage names and phone numbers** are visible to anyone with the link. Use contacts you're comfortable sharing.
- **Keep safe:** your Cloudflare login, your Google account, and the Google Sheet. Losing access means you can't update the site or read the answers.

---

## 13. Cheat sheet: "I want to change ___"

| I want to change | Open | Look for |
|---|---|---|
| Names | `config.js` | `bride`, `groom` |
| Wedding date or time | `config.js` | `weddingDate`, `ceremonyTime` |
| Venue names, addresses, map links | `config.js` | `ceremony`, `reception` |
| RSVP deadline or contact numbers | `config.js` | `rsvpDeadline`, `contacts` |
| Entourage names | `config.js` | `ENTOURAGE` |
| Where RSVPs are saved | `config.js` | `scriptUrl` |
| FAQ answers, gift message, attire wording | `index.html` | `id="faqs"`, `id="gift"`, `id="attire"` |
| Remove or reorder a section | `index.html` | the `<section>` block |
| Colors or fonts | `style.css` | the top `:root` block |
| Couple photo, venue pictures | `assets/` folder | replace the file with the same name |
| Outfit figure colors | `script.js` | the `FIGS` list |
| Anything about how it behaves | `script.js` | (ask for help before editing) |
