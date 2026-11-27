/* ==========================================================================
   script.js : how the invitation BEHAVES
   --------------------------------------------------------------------------
   You normally do not need to edit this file. Your details live in config.js.
   It runs after config.js and does these jobs, in order:
     3a  fills the text from config.js, draws the attire figures, builds the entourage,
         sets the map buttons and QR codes
     3b  the intro (tap to open), the scroll animations and the countdown
     3c  the RSVP form (saves to your Google Sheet)
   ========================================================================== */

/* ==========================================================
   3a) SCRIPTS: fill in the text from the settings
   ========================================================== */
const TZ = "Asia/Manila";
const wd = new Date(CONFIG.weddingDate);
const fmt = (o) => new Intl.DateTimeFormat("en-US", { timeZone: TZ, ...o }).format(wd);
const ord = (n) => { const s = ["th","st","nd","rd"], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); };
const dayNum = parseInt(fmt({ day: "numeric" }), 10);
const two = (n) => String(n).padStart(2, "0");
const monthNum = two(parseInt(fmt({ month: "numeric" }), 10));
const yearShort = fmt({ year: "numeric" }).slice(-2);
const timeLong = (() => {
  const h = parseInt(fmt({ hour: "numeric", hour12: false }), 10) % 24, m = parseInt(fmt({ minute: "numeric" }), 10);
  const h12 = h % 12 || 12, part = h < 12 ? "morning" : (h < 18 ? "afternoon" : "evening");
  return h12 + ":" + two(m) + " in the " + part;
})();

const VALUES = {
  bride: CONFIG.bride, groom: CONFIG.groom, city: CONFIG.city, cityUpper: CONFIG.city.toUpperCase(),
  arrivalTime: CONFIG.arrivalTime, ceremonyTime: CONFIG.ceremonyTime,
  ceremonyName: CONFIG.ceremony.name, ceremonyAddress: CONFIG.ceremony.address,
  receptionName: CONFIG.reception.name, receptionAddress: CONFIG.reception.address,
  rsvpDeadline: CONFIG.rsvpDeadline,
  dateShort: fmt({ month: "long", day: "numeric", year: "numeric" }),
  dateLine: fmt({ weekday: "long" }) + ", the " + ord(dayNum) + " of " + fmt({ month: "long" }) + " " + fmt({ year: "numeric" }),
  ceremonyTimeLine: timeLong,
  contact1: CONFIG.contacts[0].name + " " + CONFIG.contacts[0].phone,
  contact2: CONFIG.contacts[1].name + " " + CONFIG.contacts[1].phone
};
document.querySelectorAll("[data-cfg]").forEach(el => { const v = VALUES[el.dataset.cfg]; if (v != null) el.textContent = v; });
document.title = CONFIG.bride + " & " + CONFIG.groom + " – Wedding Invitation";
// Safe helper: if you delete a section from index.html, the script simply skips it instead of breaking.
const setText = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };
setText("introDate", monthNum + " . " + two(dayNum) + " . " + yearShort);
setText("sdM", monthNum);
setText("sdD", two(dayNum));
setText("sdY", yearShort);

/* ---------- Center the N+H monogram inside its oval ---------- */
function centerMono(){
  const g = document.getElementById("monoG"); if (!g || !g.getBBox) return;
  g.removeAttribute("transform");
  const b = g.getBBox();
  if (!b.width) return;
  g.setAttribute("transform", "translate(" + (50 - (b.x + b.width / 2)).toFixed(2) + " " + (62 - (b.y + b.height / 2)).toFixed(2) + ")");
}
centerMono();
window.addEventListener("load", centerMono);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(centerMono);

const esc = (t) => String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/* ---------- Entourage ---------- */
(function renderEntourage(){
  const target = document.getElementById("entourageBody");
  if (!target) return;                       // entourage section was removed
  const E = ENTOURAGE, names = (a) => a.map(n => `<div class="nm">${esc(n)}</div>`).join("");
  const two = (hl, l, hr, r) => `<div class="cols"><div><div class="hd">${hl}</div>${names(l)}</div><div><div class="hd">${hr}</div>${names(r)}</div></div>`;
  const one = (h, cap, list) => `<div class="one"><div class="hd">${h}</div>${cap ? `<div class="cap" style="margin:0 0 4px">${cap}</div>` : ""}${names(list)}</div>`;
  const pairs = E.principal.map(p => `<div class="nm">${esc(p[0])}</div>`).join("");
  const pairsR = E.principal.map(p => `<div class="nm">${esc(p[1])}</div>`).join("");
  target.innerHTML =
    `<div class="cap">With love and the blessing of our beloved parents</div>` +
    two("Parents of the Groom", E.groomParents, "Parents of the Bride", E.brideParents) +
    `<div class="cap">To guide and support us with wisdom and love</div>` +
    `<div class="hd">Principal Sponsors</div><div class="cols"><div>${pairs}</div><div>${pairsR}</div></div>` +
    `<div class="cap" style="margin-top:30px">Secondary Sponsors</div>` +
    `<div class="cols">` +
      `<div><div class="hd">Candle</div><div class="cap" style="margin:0 0 4px">To light our path as we begin our forever</div>${names(E.candle)}</div>` +
      `<div><div class="hd">Veil</div><div class="cap" style="margin:0 0 4px">To clothe us in unity, protection, and devotion</div>${names(E.veil)}</div>` +
    `</div>` +
    `<div style="margin-top:20px">` + one("Cord", "To bind us together in love and faithfulness", E.cord) + `</div>` +
    `<div class="cap">To stand as our closest witnesses and steadfast support</div>` +
    two("Best Men", E.bestMen, "Maid of Honor", E.maidOfHonor) +
    `<div class="cap">To walk with us in joy, friendship, and celebration</div>` +
    two("Groomsmen", E.groomsmen, "Bridesmaids", E.bridesmaids) +
    `<div class="hd" style="margin-top:34px">Wedding Bearers</div>` +
    `<div style="margin-top:10px">` + one("Ring Bearer", "To carry the symbol of our love", [E.ringBearer]) + `</div>` +
    `<div style="margin-top:16px">` + one("Bible Bearer", "To carry the symbol of our faith", [E.bibleBearer]) + `</div>` +
    `<div style="margin-top:16px">` + one("Coin Bearer", "To carry the symbol of our treasure", [E.coinBearer]) + `</div>`;
})();


/* ---------- Attire illustrations (drawn in code, no images needed) ---------- */
const SKIN = "#E9C7A6", SKIN2 = "#DDB48F", HAIR = "#2B2420", BARONG = "#F1E5CB";
function man(o = {}) {
  const top = o.top || BARONG, pants = o.pants || "#1E1B19", bar = o.barong !== false, short = !!o.short;
  const edge = bar ? 'stroke="#CBBB98" stroke-width=".8"' : "";
  const end = short ? 74 : 100, hand = short ? 100 : 103;
  const collar = bar
    ? '<path d="M-6 33L0 41 6 33" fill="none" stroke="rgba(110,90,60,.45)" stroke-width="1"/><path d="M0 41V106" stroke="rgba(110,90,60,.35)" stroke-width=".9"/>'
    : `<path d="M-7 33L0 42 7 33" fill="${top}" stroke="rgba(0,0,0,.28)" stroke-width="1"/>`;
  const fore = short ? `<path d="M-24 ${end}L-22 ${hand}H-17L-18 ${end}Z" fill="${SKIN}"/><path d="M24 ${end}L22 ${hand}H17L18 ${end}Z" fill="${SKIN}"/>` : "";
  return `<g transform="translate(0 6)">
    <rect x="-3.5" y="29" width="7" height="7" fill="${SKIN2}"/>
    <path d="M-19 40Q-19 34 -9 33H9Q19 34 19 40L21 106H-21Z" fill="${top}" ${edge}/>
    <path d="M-19 40L-24 ${end}H-18L-13 46Z" fill="${top}" ${edge}/><path d="M19 40L24 ${end}H18L13 46Z" fill="${top}" ${edge}/>
    ${fore}
    <ellipse cx="-21" cy="${hand + 3}" rx="3.4" ry="5" fill="${SKIN}"/><ellipse cx="21" cy="${hand + 3}" rx="3.4" ry="5" fill="${SKIN}"/>
    ${collar}
    <path d="M-20 106H20L19 200H3L0 128L-3 200H-19Z" fill="${pants}"/>
    <ellipse cx="-11" cy="202" rx="9" ry="3.2" fill="#1a1512"/><ellipse cx="11" cy="202" rx="9" ry="3.2" fill="#1a1512"/>
    <ellipse cx="0" cy="20" rx="8.5" ry="10.5" fill="${SKIN}"/>
    <path d="M-9 19C-9 8 -4 5 0 5S9 8 9 19C6 14 3 13 0 13S-6 14 -9 19Z" fill="${HAIR}"/>
  </g>`;
}
function woman(o = {}) {
  const g = o.gown || "#C98C94", style = o.style || "gown", sleeve = o.sleeve || "cap", hair = o.hair || HAIR;
  const back = `<path d="M-12 16C-15 42 -12 64 -8 76H8C12 64 15 42 12 16Z" fill="${hair}"/>`;
  const head = `<ellipse cx="0" cy="20" rx="8" ry="10" fill="${SKIN}"/><path d="M-8 18C-8 8 -4 5 0 5S8 8 8 18C5 13 2.500 12 0 12S-5 13 -8 18Z" fill="${hair}"/>`;
  const arms = `<path d="M-14 42L-21 98H-16.500L-11 52Z" fill="${SKIN}"/><path d="M14 42L21 98H16.500L11 52Z" fill="${SKIN}"/>`;
  const neck = `<rect x="-3" y="29" width="6" height="8" fill="${SKIN2}"/><path d="M-13 38Q0 48 13 38L12 52H-12Z" fill="${SKIN}"/>`;
  let body = "";
  if (style === "slacks") {
    const pants = o.pants || "#1E1B19", top = o.top || "#7A4F3A";
    body = `${arms}${neck}
      <path d="M-13 44Q0 40 13 44L14 88H-14Z" fill="${top}"/>
      <path d="M-14 44L-22 70L-12 72Z" fill="${top}"/><path d="M14 44L22 70L12 72Z" fill="${top}"/>
      <path d="M-14 86H14L21 200H3L0 112L-3 200H-21Z" fill="${pants}"/>
      <ellipse cx="-12" cy="202" rx="9" ry="3.200" fill="#1a1512"/><ellipse cx="12" cy="202" rx="9" ry="3.200" fill="#1a1512"/>`;
  } else {
    const hem = style === "maxi" ? 190 : 206, spread = style === "maxi" ? 22 : 26;
    const sl = sleeve === "cap" ? `<path d="M-14 38L-24 60L-12 57Z" fill="${g}"/><path d="M14 38L24 60L12 57Z" fill="${g}"/>`
             : sleeve === "short" ? `<path d="M-14 38L-25 66L-13 64Z" fill="${g}"/><path d="M14 38L25 66L13 64Z" fill="${g}"/>`
             : `<path d="M-11 38L-9 52M11 38L9 52" stroke="${g}" stroke-width="2.500"/>`;
    const legs = style === "maxi" ? `<path d="M-8 188H-3V200H-8Z M3 188H8V200H3Z" fill="${SKIN}"/>` : "";
    body = `${arms}${neck}
      <path d="M-13 50Q0 44 13 50L11 82H-11Z" fill="${g}"/>
      <path d="M-11 78Q-15 120 -${spread} ${hem}H${spread}Q15 120 11 78Z" fill="${g}"/>
      <path d="M-3 82Q-8 140 -12 ${hem}H-1Q3 140 1 82Z" fill="rgba(0,0,0,.1)"/>
      <path d="M5 90Q9 140 14 ${hem}" fill="none" stroke="rgba(255,255,255,.25)" stroke-width="1.200"/>
      ${sl}${legs}`;
  }
  return `<g transform="translate(0 6)">${back}${body}${head}</g>`;
}
const FIGS = {
  sponsors: [man(), woman({ gown: "#C98C94", sleeve: "cap" }), man(), woman({ gown: "#D9A3A6", sleeve: "cap" }), man(), woman({ gown: "#B97983", sleeve: "cap" })],
  entourage: [man(), woman({ gown: "#8E9A6C", sleeve: "strap" }), man(), woman({ gown: "#1F5A3F", sleeve: "strap" }), man(), woman({ gown: "#1D3A2C", sleeve: "strap" })],
  guests: [man({ barong: false, top: "#6E7A55", pants: "#CDBB9C", short: false }), woman({ style: "maxi", gown: "#9AA57A", sleeve: "strap" }),
           man({ barong: false, top: "#A5805F", pants: "#1E1B19", short: true }), woman({ style: "slacks", top: "#7A4F3A" }),
           man({ barong: true }), woman({ style: "maxi", gown: "#6F7A4C", sleeve: "short" })]
};
document.querySelectorAll("[data-fig]").forEach(el => {
  const list = FIGS[el.dataset.fig] || [];
  el.insertAdjacentHTML("beforeend",
    `<svg viewBox="0 0 342 214" role="img" aria-label="Attire illustration">` + list.map((f, i) => f.replace("translate(0 6)", "translate(" + (31 + i * 56) + " 6)")).join("") + `</svg>`);
});

/* ---------- Maps + QR codes ---------- */
function mapUrl(v){
  return v.map || ("https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(v.name + ", " + v.address));
}
[["Ceremony", CONFIG.ceremony], ["Reception", CONFIG.reception]].forEach(([key, v]) => {
  const url = mapUrl(v), box = document.getElementById("qr" + key), link = document.getElementById("map" + key);
  if (link) link.href = url;
  if (!box) return;                          // venues section was removed
  // The QR codes for the two map links above are already built into the page.
  // If you change a map link in CONFIG, the code is redrawn automatically (needs internet).
  if (box.dataset.url !== url && window.QRCode){
    box.innerHTML = "";
    try { new QRCode(box, { text: url, width: 150, height: 150, colorDark: "#35201A", colorLight: "#ffffff", correctLevel: QRCode.CorrectLevel.M }); }
    catch (e) { box.style.display = "none"; }
  }
});

/* ==========================================================
   3b) SCRIPTS: intro (tap to open) and countdown
   ========================================================== */
const intro = document.getElementById("intro");
const env   = document.getElementById("envelope");
const main  = document.getElementById("invitation");

function setupReveal(){
  if (!("IntersectionObserver" in window)) return;
  const items = document.querySelectorAll(".page .sec:not(.save) > *, .page footer > *");
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.08 });
  items.forEach(el => { el.classList.add("rv"); io.observe(el); });
}
function revealInvitation(){
  intro.classList.add("leaving");
  main.classList.add("show");
  document.body.classList.remove("locked");
  window.scrollTo(0, 0);
}
function openInvite(){
  if (intro.classList.contains("go")) return;
  intro.classList.add("go");                    // text + envelope lift away (no opening animation)
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const t = reduce ? [0, 0] : [550, 1600];
  setTimeout(revealInvitation, t[0]);           // fade into the invitation
  setTimeout(() => { intro.classList.add("gone"); main.focus({ preventScroll: true }); }, t[1]);
}
if (env) env.addEventListener("click", openInvite);
setupReveal();
if (!intro){ main.classList.add("show"); document.body.classList.remove("locked"); }   // no intro on the page: show the invitation straight away
if (location.hash && intro){                    // links like ...#rsvp skip the envelope
  intro.classList.add("gone"); main.classList.add("show"); document.body.classList.remove("locked");
}

/* ---------- Countdown ---------- */
function tick(){
  const diff = new Date(CONFIG.weddingDate) - new Date();
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = two(v); };
  if (diff <= 0){ ["cdD","cdH","cdM","cdS"].forEach(id => set(id, 0)); return; }
  set("cdD", Math.floor(diff / 864e5)); set("cdH", Math.floor(diff / 36e5) % 24);
  set("cdM", Math.floor(diff / 6e4) % 60); set("cdS", Math.floor(diff / 1e3) % 60);
}
tick(); setInterval(tick, 1000);

/* ==========================================================
   3c) SCRIPTS: RSVP form
   ========================================================== */
(function setupRsvp(){
  if (!document.getElementById("rsvpForm")) return;      // RSVP section was removed
  const form = document.getElementById("rsvpForm"), extra = document.getElementById("extra");
  const msg = document.getElementById("msg"), btn = document.getElementById("sendBtn");
  const box = document.getElementById("rsvpBox"), gate = document.getElementById("gate");
  const rsvpBtn = document.getElementById("rsvpBtn"), note = document.getElementById("rsvpNote");

  if (CONFIG.accessCode){
    note.innerHTML = "Our RSVP form is <b>password-protected</b>. Please message us to assist you in accessing the form.";
    form.hidden = true; gate.hidden = false;
  }
  rsvpBtn.addEventListener("click", () => {
    const open = box.hidden;
    box.hidden = !open;
    rsvpBtn.setAttribute("aria-expanded", String(open));
    if (open) box.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  document.getElementById("codeBtn").addEventListener("click", () => {
    const ok = document.getElementById("code").value.trim().toLowerCase() === CONFIG.accessCode.toLowerCase();
    const g = document.getElementById("gmsg");
    if (ok){ gate.hidden = true; form.hidden = false; }
    else { g.className = "error"; g.textContent = "That code isn’t right. Please check your invitation message."; }
  });
  form.addEventListener("change", () => extra.classList.toggle("hidden", form.attending.value !== "Yes"));

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.className = "";
    if (form.website.value) return;                       // bot caught
    if (!form.name.value.trim() || !form.attending.value){
      msg.className = "error";
      msg.textContent = "Please enter your name and choose whether you can attend.";
      return;
    }
    const yes = form.attending.value === "Yes";
    const data = {
      name: form.name.value.trim(), attending: form.attending.value,
      guests: yes ? form.guests.value : "0", note: form.note.value.trim()
    };
    if (CONFIG.scriptUrl){                                // save to Google Sheet
      btn.disabled = true; btn.textContent = "Sending…";
      try{
        await fetch(CONFIG.scriptUrl, { method: "POST", mode: "no-cors", body: new URLSearchParams(data) });
        done(yes);
      }catch(err){
        msg.className = "error";
        msg.textContent = "Couldn’t send. Check your internet and try again.";
        btn.disabled = false; btn.textContent = "Send my RSVP";
      }
      return;
    }
    const body = Object.entries(data).map(([k, v]) => `${k}: ${v}`).join("\n");   // fallback: email app
    location.href = `mailto:${CONFIG.fallbackEmail}?subject=${encodeURIComponent("Wedding RSVP – " + data.name)}&body=${encodeURIComponent(body)}`;
    done(yes);
  });
  function done(yes){
    form.querySelectorAll("input,select,textarea,button").forEach(el => el.disabled = true);
    msg.textContent = yes ? "Thank you! We can’t wait to celebrate with you." : "Thank you for letting us know. You’ll be missed.";
  }
})();
