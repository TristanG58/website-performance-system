/**
 * ============================================================================
 *  consent.js — WPS Level-2 Consent Manager (Vanilla JS, ZERO dependencies)
 * ============================================================================
 *  Setzt den gemeinsamen Consent-Vertrag um (docs/architecture/consent.md):
 *   - Default Deny fuer optionale Dienste (analytics / marketing / externalMedia)
 *   - Speicherung des Consent-State (localStorage, Fallback: Session-Speicher)
 *   - Banner + Einstellungs-Modal werden per JS erzeugt (kein dupliziertes Markup)
 *   - Widerruf / erneute Konfiguration ueber den Footer-Trigger
 *   - Event `wps:consentchange` bei jeder gueltigen Entscheidung
 *   - Statische Service-Registry-Schnittstelle; laedt derzeit KEINEN Dienst
 *
 *  Sicherheit: kein eval, kein new Function, keine Ausfuehrung von Code aus
 *  Config-Strings, keine ungeprueften Script-URLs. Loader werden ausschliesslich
 *  statisch im Code registriert (serviceLoaders).
 *
 *  Konfiguration: liest <script type="application/json" id="wps-consent-config">.
 *  Fehlt/ungueltig -> sichere Defaults (nur notwendig aktiv).
 * ============================================================================
 */

const DAY_MS = 24 * 60 * 60 * 1000;
const OPTIONAL = ["analytics", "marketing", "externalMedia"];
const ALL_CATEGORIES = ["necessary", ...OPTIONAL];

/* ---- Sichere Default-Konfiguration (falls Injektion fehlt) --------------- */
const DEFAULT_CONFIG = {
  enabled: true,
  version: "2026-07-1",
  validityDays: 182,
  storageKey: "wps_consent",
  eventName: "wps:consentchange",
  categories: {
    necessary: { enabled: true, required: true },
    analytics: { enabled: true, required: false },
    marketing: { enabled: true, required: false },
    externalMedia: { enabled: true, required: false },
  },
  services: [],
  texts: {
    bannerTitle: "Datenschutz-Einstellungen",
    bannerBody:
      "Diese Website nutzt nur technisch notwendige Speicherungen. Optionale Kategorien bleiben deaktiviert, bis Sie zustimmen.",
    acceptAll: "Alle akzeptieren",
    acceptNecessary: "Nur notwendige",
    settings: "Einstellungen",
    save: "Auswahl speichern",
    settingsTitle: "Datenschutz-Einstellungen",
    settingsIntro: "Waehlen Sie aus, welche optionalen Kategorien Sie zulassen moechten.",
    close: "Schliessen",
    triggerLabel: "Cookie-Einstellungen",
    categories: {
      necessary: { title: "Notwendig", body: "Fuer den Betrieb der Website erforderlich. Immer aktiv." },
      analytics: { title: "Analyse", body: "Hilft, die Nutzung der Website anonymisiert zu verstehen." },
      marketing: { title: "Marketing", body: "Ermoeglicht Werbe- und Remarketing-Funktionen." },
      externalMedia: { title: "Externe Medien", body: "Erlaubt eingebettete Inhalte wie Karten oder Videos." },
    },
  },
};

/* ---- URL-Allowlist fuer eingebettete Medien ------------------------------
 *  Nur https + fest verdrahtete Hosts. Keine Ausfuehrung, nur iframe-src. */
const MAP_HOST_ALLOWLIST = ["www.google.com", "maps.google.com"];
function isAllowedMapUrl(url) {
  try {
    const u = new URL(String(url));
    return u.protocol === "https:" && MAP_HOST_ALLOWLIST.includes(u.host);
  } catch (e) {
    return false;
  }
}

/* ---- Statische Service-Registry-Schnittstelle ---------------------------
 *  Loader werden HIER statisch per Service-ID registriert. Ausgewaehlt wird
 *  ausschliesslich ueber die bekannte ID aus [data-consent-service]. Erzeugt
 *  nur das erwartete iframe-Markup; KEIN eval, KEIN new Function, KEINE
 *  dynamische Codeausfuehrung, KEINE Script-URLs aus beliebiger Config. */
const serviceLoaders = {
  "google-maps": {
    load(el) {
      if (el.querySelector("iframe.wps-consent-media-frame")) return; // Mehrfachladung verhindern
      const url = el.getAttribute("data-consent-src");
      if (!isAllowedMapUrl(url)) {
        console.warn("[wps-consent] Ungueltige/blockierte Maps-URL – Karte nicht geladen:", url);
        return; // Platzhalter bleibt bestehen
      }
      const f = document.createElement("iframe");
      f.className = "wps-consent-media-frame";
      f.title = el.getAttribute("data-consent-title") || "Karte";
      f.loading = "lazy";
      f.referrerPolicy = "no-referrer-when-downgrade";
      f.setAttribute("allowfullscreen", "");
      f.src = url; // src ERST jetzt gesetzt -> Request erst nach Consent
      const ph = el.querySelector(".wps-consent-media-placeholder");
      if (ph) ph.hidden = true;
      el.appendChild(f);
      el.classList.add("wps-consent-media--loaded");
    },
    unload(el) {
      const f = el.querySelector("iframe.wps-consent-media-frame");
      if (f) f.remove();
      const ph = el.querySelector(".wps-consent-media-placeholder");
      if (ph) ph.hidden = false;
      el.classList.remove("wps-consent-media--loaded");
    },
  },
};

/* ---- Modul-Zustand ------------------------------------------------------- */
let CONFIG = DEFAULT_CONFIG;
let memoryState = null;      // Fallback, falls localStorage blockiert ist
let bannerEl = null;
let modalEl = null;
let backdropEl = null;
let lastFocus = null;        // Element, das das Modal geoeffnet hat
let needsReconsent = false;  // gespeicherter State war veraltet (Versionswechsel)

/* ========================================================================= *
 *  Konfiguration
 * ========================================================================= */
function readConfig() {
  try {
    const el = document.getElementById("wps-consent-config");
    if (el && el.textContent) {
      const parsed = JSON.parse(el.textContent);
      if (parsed && typeof parsed === "object") return parsed;
    }
  } catch (e) {
    console.warn("[wps-consent] Config-JSON ungueltig, nutze Defaults.", e);
  }
  return DEFAULT_CONFIG;
}

function txt(path, fallback) {
  const t = CONFIG.texts || {};
  const parts = path.split(".");
  let v = t;
  for (const p of parts) {
    if (v == null) break;
    v = v[p];
  }
  return typeof v === "string" ? v : fallback != null ? fallback : "";
}

/** Optionale Kategorien, die in der Config verfuegbar (enabled) sind. */
function availableOptional() {
  const cats = CONFIG.categories || {};
  return OPTIONAL.filter((c) => cats[c] && cats[c].enabled !== false);
}

/* ========================================================================= *
 *  Storage (defensiv — darf die Seite nie beschaedigen)
 * ========================================================================= */
function storageRead() {
  try {
    const raw = window.localStorage.getItem(CONFIG.storageKey);
    return raw != null ? raw : memoryState;
  } catch (e) {
    return memoryState;
  }
}
function storageWrite(raw) {
  memoryState = raw; // immer im Speicher halten
  try {
    window.localStorage.setItem(CONFIG.storageKey, raw);
  } catch (e) {
    /* localStorage blockiert -> nur Session-Speicher, kein Fehler nach aussen */
  }
}
function storageClear() {
  memoryState = null;
  try {
    window.localStorage.removeItem(CONFIG.storageKey);
  } catch (e) {
    /* ignore */
  }
}

/* ========================================================================= *
 *  Consent-State
 * ========================================================================= */
/** Normalisiert Kategorien: necessary IMMER true, Rest strikt boolean. */
function normalizeCategories(cats) {
  const c = cats || {};
  return {
    necessary: true,
    analytics: c.analytics === true,
    marketing: c.marketing === true,
    externalMedia: c.externalMedia === true,
  };
}

function buildState(categories, method) {
  const now = new Date();
  const days = Number(CONFIG.validityDays) > 0 ? Number(CONFIG.validityDays) : 182;
  return {
    version: String(CONFIG.version),
    timestamp: now.toISOString(),
    expiresAt: new Date(now.getTime() + days * DAY_MS).toISOString(),
    categories: normalizeCategories(categories),
    method: method,
  };
}

/** Struktur-Pruefung nahe am consent-state-Schema. */
function isValidState(s) {
  if (!s || typeof s !== "object") return false;
  if (typeof s.version !== "string" || !s.version) return false;
  if (typeof s.timestamp !== "string" || typeof s.expiresAt !== "string") return false;
  if (!s.categories || typeof s.categories !== "object") return false;
  for (const c of ALL_CATEGORIES) if (typeof s.categories[c] !== "boolean") return false;
  if (s.categories.necessary !== true) return false;
  return true;
}

/** Liest gespeicherten State, sicher geparst. null bei Fehler/Fehlen. */
function getConsent() {
  const raw = storageRead();
  if (!raw) return null;
  try {
    const s = JSON.parse(raw);
    return isValidState(s) ? s : null;
  } catch (e) {
    return null; // ungueltiges JSON -> als kein Consent behandeln
  }
}

function isExpired(s) {
  const t = Date.parse(s.expiresAt);
  return !Number.isFinite(t) || t <= Date.now();
}
function isCurrentVersion(s) {
  return s.version === String(CONFIG.version);
}

function hasConsent(category) {
  if (category === "necessary") return true;
  const s = getConsent();
  if (!s || !isValidState(s) || isExpired(s) || !isCurrentVersion(s)) return false;
  return s.categories[category] === true;
}

/* ========================================================================= *
 *  Entscheidung speichern + Event + Service-Loading
 * ========================================================================= */
function persist(categories, method) {
  const finalMethod = needsReconsent ? "reconsent" : method;
  const state = buildState(categories, finalMethod);
  storageWrite(JSON.stringify(state));
  needsReconsent = false;
  dispatchChange(state);
  applyServiceConsent(state);
  return state;
}

function dispatchChange(state) {
  try {
    window.dispatchEvent(new CustomEvent(CONFIG.eventName, { detail: state }));
  } catch (e) {
    /* CustomEvent nicht verfuegbar -> still ignorieren */
  }
}

/** Sucht einen Service in der (autoritativen) Registry CONFIG.services. */
function findService(id) {
  const reg = Array.isArray(CONFIG.services) ? CONFIG.services : [];
  return reg.find((s) => s && s.id === id) || null;
}

/** DOM-getrieben: findet alle Medien-Platzhalter [data-consent-service] und
 *  laedt/entlaedt strikt anhand der autoritativen Registry (CONFIG.services)
 *  aus config/site.js. Kategorie + enabled kommen NUR aus der Registry; der
 *  statische Loader liefert ausschliesslich die Lade-/Entlade-Mechanik.
 *  Fail-closed: geladen wird nur, wenn Registry-Eintrag + Loader + bekannte,
 *  zugestimmte Kategorie + enabled zusammentreffen. Ausgeloest bei jeder
 *  gueltigen Entscheidung (persist) und bei Init mit gueltigem Consent. */
function applyServiceConsent(state) {
  const cats = (state && state.categories) || {};
  const nodes = document.querySelectorAll("[data-consent-service]");
  nodes.forEach((el) => {
    const id = el.getAttribute("data-consent-service");
    const loader = serviceLoaders[id];               // statische Mechanik, per ID
    const svc = findService(id);                     // Metadaten aus der Registry
    // bekannte Consent-Kategorie? (necessary/analytics/marketing/externalMedia)
    const category = svc && svc.category;
    const knownCat = !!category && Object.prototype.hasOwnProperty.call(cats, category);
    const okToLoad =
      !!loader &&                                    // statischer Loader existiert
      !!svc &&                                       // Registry-Eintrag existiert
      svc.enabled === true &&                        // in der Config aktiviert
      knownCat &&                                    // Kategorie ist bekannt
      cats[category] === true;                       // Kategorie zugestimmt
    if (!loader) {
      // ohne statischen Loader wird nichts erzeugt; unbekannte IDs nie ausgefuehrt
      if (svc) console.warn("[wps-consent] Kein statischer Loader fuer Service:", id);
      return;
    }
    try {
      if (okToLoad) loader.load(el);
      else loader.unload(el);                        // fail-closed: nicht laden / entladen
    } catch (e) {
      console.warn("[wps-consent] Medien-Service-Fehler:", id, e);
    }
  });
}

/* ========================================================================= *
 *  Oeffentliche Aktionen
 * ========================================================================= */
function acceptAll() {
  const cats = { necessary: true };
  for (const c of OPTIONAL) cats[c] = availableOptional().includes(c);
  persist(cats, "banner-accept-all");
  hideBanner();
  closeModal();
}
function acceptNecessary() {
  persist({ necessary: true, analytics: false, marketing: false, externalMedia: false }, "banner-necessary");
  hideBanner();
  closeModal();
}
/** categories: { analytics, marketing, externalMedia } aus dem Modal. */
function updateConsent(categories) {
  persist({ necessary: true, ...categories }, "settings");
  hideBanner();
  closeModal();
}
function resetConsent() {
  storageClear();
  needsReconsent = false;
  showBanner();
}

/* ========================================================================= *
 *  DOM: Banner
 * ========================================================================= */
function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text; // textContent -> kein HTML-Injection-Risiko
  return n;
}

function buildBanner() {
  const banner = el("section", "wps-consent-banner");
  banner.setAttribute("role", "region");
  banner.setAttribute("aria-label", txt("bannerTitle", "Datenschutz-Einstellungen"));

  const body = el("div", "wps-consent-banner-text");
  body.appendChild(el("strong", "wps-consent-banner-title", txt("bannerTitle")));
  body.appendChild(el("p", "wps-consent-banner-body", txt("bannerBody")));

  const actions = el("div", "wps-consent-banner-actions");
  const bAll = el("button", "wps-consent-button wps-consent-button--primary", txt("acceptAll"));
  bAll.type = "button";
  bAll.addEventListener("click", acceptAll);
  const bNec = el("button", "wps-consent-button wps-consent-button--ghost", txt("acceptNecessary"));
  bNec.type = "button";
  bNec.addEventListener("click", acceptNecessary);
  const bSet = el("button", "wps-consent-button wps-consent-button--link", txt("settings"));
  bSet.type = "button";
  bSet.addEventListener("click", () => openConsentSettings());

  actions.append(bAll, bNec, bSet);
  banner.append(body, actions);
  return banner;
}

function showBanner() {
  if (!bannerEl) {
    bannerEl = buildBanner();
    document.body.appendChild(bannerEl);
  }
  bannerEl.hidden = false;
}
function hideBanner() {
  if (bannerEl) bannerEl.hidden = true;
}

/* ========================================================================= *
 *  DOM: Einstellungs-Modal (role=dialog, aria-modal, Fokus-Trap)
 * ========================================================================= */
function focusable(container) {
  return Array.from(
    container.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
    )
  ).filter((n) => n.offsetParent !== null || n === document.activeElement);
}

function onModalKeydown(e) {
  if (e.key === "Escape") {
    e.preventDefault();
    closeModal();
    return;
  }
  if (e.key !== "Tab") return;
  const items = focusable(modalEl);
  if (items.length === 0) return;
  const first = items[0];
  const last = items[items.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

function buildModal() {
  backdropEl = el("div", "wps-consent-backdrop");
  backdropEl.addEventListener("click", closeModal); // Klick auf Backdrop = schliessen ohne Speichern

  const modal = el("div", "wps-consent-modal");
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", "wps-consent-modal-title");
  modal.addEventListener("click", (e) => e.stopPropagation());

  const head = el("div", "wps-consent-modal-head");
  const title = el("h2", "wps-consent-modal-title", txt("settingsTitle"));
  title.id = "wps-consent-modal-title";
  const closeX = el("button", "wps-consent-close", "×");
  closeX.type = "button";
  closeX.setAttribute("aria-label", txt("close", "Schliessen"));
  closeX.addEventListener("click", closeModal);
  head.append(title, closeX);

  const intro = el("p", "wps-consent-modal-intro", txt("settingsIntro"));

  const list = el("div", "wps-consent-categories");
  const current = getConsent();
  for (const cat of ALL_CATEGORIES) {
    if (cat !== "necessary" && !availableOptional().includes(cat)) continue;
    const required = cat === "necessary";
    const row = el("div", "wps-consent-category");

    const label = el("label", "wps-consent-category-label");
    const input = document.createElement("input");
    input.type = "checkbox";
    input.className = "wps-consent-checkbox";
    input.dataset.category = cat;
    input.checked = required ? true : !!(current && current.categories && current.categories[cat]);
    if (required) {
      input.disabled = true;
      input.setAttribute("aria-disabled", "true");
    }

    const labelText = el("span", "wps-consent-category-title", txt("categories." + cat + ".title", cat));
    label.append(input, labelText);

    const desc = el("p", "wps-consent-category-body", txt("categories." + cat + ".body"));
    row.append(label, desc);
    list.appendChild(row);
  }

  const actions = el("div", "wps-consent-modal-actions");
  const bSave = el("button", "wps-consent-button wps-consent-button--primary", txt("save"));
  bSave.type = "button";
  bSave.addEventListener("click", () => {
    const picked = {};
    for (const c of OPTIONAL) {
      const box = list.querySelector('input[data-category="' + c + '"]');
      picked[c] = !!(box && box.checked);
    }
    updateConsent(picked);
  });
  const bAll = el("button", "wps-consent-button wps-consent-button--ghost", txt("acceptAll"));
  bAll.type = "button";
  bAll.addEventListener("click", acceptAll);
  actions.append(bSave, bAll);

  modal.append(head, intro, list, actions);
  backdropEl.appendChild(modal);
  return backdropEl;
}

function openConsentSettings() {
  lastFocus = document.activeElement;
  // frisch aufbauen, damit aktuelle Auswahl angezeigt wird
  if (backdropEl && backdropEl.parentNode) backdropEl.parentNode.removeChild(backdropEl);
  backdropEl = buildModal();
  modalEl = backdropEl.querySelector(".wps-consent-modal");
  document.body.appendChild(backdropEl);
  document.addEventListener("keydown", onModalKeydown, true);
  // Fokus in den Dialog setzen
  const first = focusable(modalEl)[0];
  (first || modalEl).focus();
}

function closeModal() {
  document.removeEventListener("keydown", onModalKeydown, true);
  if (backdropEl && backdropEl.parentNode) backdropEl.parentNode.removeChild(backdropEl);
  backdropEl = null;
  modalEl = null;
  // Fokus zum ausloesenden Element zuruecksetzen
  if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  lastFocus = null;
}

/* ========================================================================= *
 *  Footer-Trigger
 * ========================================================================= */
function wireTriggers() {
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-consent-settings]");
    if (t) {
      e.preventDefault();
      openConsentSettings();
    }
  });
}

/* ========================================================================= *
 *  Initialisierung
 * ========================================================================= */
function initConsentManager(config) {
  CONFIG = config || readConfig();
  if (CONFIG.enabled === false) return; // Consent global deaktiviert -> nichts tun

  wireTriggers();

  const stored = getConsentRaw();
  if (stored.state && isValidState(stored.state) && !isExpired(stored.state) && isCurrentVersion(stored.state)) {
    // gueltiger, aktueller Consent -> Event + zugelassene Services laden, kein Banner
    dispatchChange(stored.state);
    applyServiceConsent(stored.state);
  } else {
    // fehlend / ungueltig / abgelaufen / andere Version -> optionale bleiben aus, Banner zeigen
    needsReconsent = !!(stored.state && stored.parsedOk && !isCurrentVersion(stored.state));
    showBanner();
  }
}

/** Rohzugriff mit Diagnose (parsedOk), fuer die Reconsent-Erkennung. */
function getConsentRaw() {
  const raw = storageRead();
  if (!raw) return { state: null, parsedOk: false };
  try {
    const s = JSON.parse(raw);
    return { state: s, parsedOk: true };
  } catch (e) {
    return { state: null, parsedOk: false };
  }
}

/* ---- Auto-Init (genau einmal) ------------------------------------------- */
function boot() {
  if (window.__wpsConsentBooted) return;
  window.__wpsConsentBooted = true;
  initConsentManager(readConfig());
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}

/* ---- Programmatischer Zugriff (optional) -------------------------------- */
const WpsConsent = {
  initConsentManager,
  getConsent,
  hasConsent,
  acceptAll,
  acceptNecessary,
  updateConsent,
  openConsentSettings,
  resetConsent,
};
try { window.WpsConsent = WpsConsent; } catch (e) { /* ignore */ }

export {
  initConsentManager,
  getConsent,
  hasConsent,
  acceptAll,
  acceptNecessary,
  updateConsent,
  openConsentSettings,
  resetConsent,
};
export default WpsConsent;
