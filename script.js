/* ===== EDIT THIS SECTION ONLY (no passwords or API keys here; this file is public) ===== */
const CONFIG = {
  whatsapp: "923066255136",  // international format, no + and no leading zero
  email: "ijaza504@gmail.com",
  formEndpoint: ""    // Formspree URL or Google Apps Script web-app URL. Empty = form will NOT claim success.
};
/* ======================================================================================= */

const CITIES = ["Karachi","Lahore","Faisalabad","Multan","Peshawar","Mardan","Mingora","Swat","Islamabad","Rawalpindi","Quetta","Hyderabad","Sukkur","Bahawalpur","Sargodha","Sahiwal","Dera Ghazi Khan","Dera Ismail Khan","Layyah","Jhang","Kohat","Hangu","Swabi","Taxila"];

document.getElementById("yr").textContent = new Date().getFullYear();
document.getElementById("cities").innerHTML = CITIES.map(c => `<li>${c}</li>`).join("");
document.getElementById("cityList").innerHTML = CITIES.map(c => `<option value="${c}">`).join("");

// Mobile menu
const btn = document.querySelector(".menu-btn"), nav = document.getElementById("nav");
btn.addEventListener("click", () => { const o = nav.classList.toggle("open"); btn.setAttribute("aria-expanded", o); });
nav.addEventListener("click", e => { if (e.target.tagName === "A") { nav.classList.remove("open"); btn.setAttribute("aria-expanded", false); } });

// Contact numbers, email, map and hours are written directly in index.html.

// Form
const form = document.getElementById("quoteForm"), msg = document.getElementById("formMsg");
form.pickupDate.min = new Date().toISOString().split("T")[0];

function show(cls, html) { msg.innerHTML = `<div class="msg ${cls}">${html}</div>`; msg.scrollIntoView({block:"nearest"}); }
function esc(s) { return s.replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])); }

function validate() {
  let first = null;
  form.querySelectorAll(".err").forEach(e => e.remove());
  form.querySelectorAll("[aria-invalid]").forEach(e => e.removeAttribute("aria-invalid"));
  const bad = (el, text) => {
    el.setAttribute("aria-invalid", "true");
    const s = document.createElement("span"); s.className = "err"; s.textContent = text;
    el.parentElement.appendChild(s); first = first || el;
  };
  form.querySelectorAll("[required]").forEach(el => { if (!el.value.trim()) bad(el, "This field is required."); });
  const digits = v => v.replace(/\D/g, "").length;
  if (form.phone.value.trim() && (digits(form.phone.value) < 10 || digits(form.phone.value) > 13 || /[^\d\s+\-()]/.test(form.phone.value))) bad(form.phone, "Enter a valid phone number, for example 0300 1234567.");
  if (form.whatsapp.value.trim() && (digits(form.whatsapp.value) < 10 || digits(form.whatsapp.value) > 13)) bad(form.whatsapp, "Enter a valid WhatsApp number or leave it empty.");
  if (form.pickupDate.value && form.pickupDate.value < form.pickupDate.min) bad(form.pickupDate, "Pickup date cannot be in the past.");
  if (first) first.focus();
  return !first;
}

function asText(d) {
  const L = {name:"Name",phone:"Phone",whatsapp:"WhatsApp",pickupCity:"Pickup city",pickupAddress:"Pickup address",destCity:"Destination city",destAddress:"Destination address",cargoType:"Cargo type",quantity:"Quantity",weight:"Est. weight",dimensions:"Dimensions",vehicle:"Vehicle",vehicleSize:"Vehicle size / container",pickupDate:"Pickup date",labour:"Labour",notes:"Notes"};
  return "Quote request\n" + Object.keys(L).filter(k => d[k]).map(k => `${L[k]}: ${d[k]}`).join("\n");
}

form.addEventListener("submit", async e => {
  e.preventDefault();
  msg.innerHTML = "";
  if (!validate()) { show("bad", "Please fix the highlighted fields and send again."); return; }
  const data = Object.fromEntries(new FormData(form).entries());
  if (data._gotcha) return; // spam trap

  if (!CONFIG.formEndpoint) {
    // Honest fallback: nothing was sent.
    const t = asText(data);
    show("info", `<strong>Online sending is not set up yet, so your request has NOT been sent yet.</strong> Send it to us now by WhatsApp or email, or copy the details.<textarea readonly rows="8" id="copyBox">${esc(t)}</textarea><div class="actions"><a class="btn wa" target="_blank" rel="noopener" href="https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(t)}">Send on WhatsApp</a><a class="btn primary" href="mailto:${CONFIG.email}?subject=${encodeURIComponent("Quote request")}&body=${encodeURIComponent(t)}">Send by email</a><button type="button" class="btn outline" id="copyBtn">Copy request</button></div>`);
    document.getElementById("copyBtn").onclick = async () => {
      try { await navigator.clipboard.writeText(asText(data)); document.getElementById("copyBtn").textContent = "Copied"; }
      catch { document.getElementById("copyBox").select(); }
    };
    return;
  }

  const submit = form.querySelector("button[type=submit]");
  submit.disabled = true; submit.textContent = "Sending...";
  try {
    const res = await fetch(CONFIG.formEndpoint, { method: "POST", headers: {"Accept":"application/json"}, body: new FormData(form) });
    if (!res.ok) throw new Error("HTTP " + res.status);
    show("ok", "<strong>Thank you.</strong> Your quote request was sent. We will contact you on the number you gave.");
    form.reset();
  } catch (err) {
    show("bad", "<strong>Your request could not be sent.</strong> Please check your internet connection and try again, or contact us by phone or WhatsApp.");
  } finally { submit.disabled = false; submit.textContent = "Send quote request"; }
});
