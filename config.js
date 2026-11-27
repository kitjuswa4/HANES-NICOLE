/* ==========================================================================
   config.js : YOUR DETAILS (this is the file you edit most)
   --------------------------------------------------------------------------
   Change the text between the quotes. Keep the quotes, commas and brackets.
   Save the file, refresh the page, and everything updates by itself:
   the names, dates, venues, QR codes, FAQs, countdown and so on.
   ========================================================================== */

const CONFIG = {
  weddingDate: "2027-01-10T14:30:00+08:00",       // ceremony date and time (Philippine time)
  bride: "Nicole",
  groom: "Hanes",
  city: "San Jose del Monte, Bulacan",

  arrivalTime: "1:00 PM",
  ceremonyTime: "2:30 PM",

  ceremony:  { name: "Capilla de Sta. Rita de Cascia", address: "San Jose del Monte, Bulacan", map: "https://maps.app.goo.gl/MbW8D1U3Pui7ymQH8" },
  reception: { name: "Catalina Events Place Rental",  address: "San Jose del Monte, Bulacan", map: "https://maps.app.goo.gl/7eY4jj8LQwDornxM8" },
  // map: paste a Google Maps share link. Leave "" to search by venue name and address.

  rsvpDeadline: "December 15, 2026",
  contacts: [ { name: "Nicole", phone: "+63 9XX XXX XXXX" }, { name: "Hanes", phone: "+63 9XX XXX XXXX" } ],

  scriptUrl: "https://script.google.com/macros/s/AKfycbxBcGo0zJOqXq9m2CE9_pE33AGjhcOUMJJaAIkYwwQz4uh6p-GHzVKa1jpnfU6NXWaIrA/exec",                                   // your Google Apps Script Web App URL (ends in /exec)
  fallbackEmail: "yourname@gmail.com",             // used only if scriptUrl is empty
  accessCode: ""                                   // optional: guests must type this code to see the RSVP form
};

const ENTOURAGE = {
  groomParents: ["Mr. Full Name", "Mrs. Full Name"],
  brideParents: ["Mr. Full Name", "Mrs. Full Name"],
  principal: [   // [ gentleman, lady ] pairs
    ["Mr. Full Name", "Mrs. Full Name"], ["Mr. Full Name", "Mrs. Full Name"],
    ["Mr. Full Name", "Mrs. Full Name"], ["Mr. Full Name", "Mrs. Full Name"],
    ["Mr. Full Name", "Mrs. Full Name"], ["Mr. Full Name", "Mrs. Full Name"]
  ],
  candle: ["Full Name", "Full Name"],
  veil:   ["Full Name", "Full Name"],
  cord:   ["Full Name", "Full Name"],
  bestMen: ["Full Name", "Full Name"],
  maidOfHonor: ["Full Name"],
  groomsmen:   ["Full Name", "Full Name", "Full Name", "Full Name"],
  bridesmaids: ["Full Name", "Full Name", "Full Name", "Full Name"],
  ringBearer: "Full Name",
  bibleBearer: "Full Name",
  coinBearer: "Full Name"
};
