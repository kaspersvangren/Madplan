// Vores Hverdag — service worker
//
// Der caches med vilje ingenting. Den findes af to grunde: at appen
// kan installeres på hjemmeskærmen, og at selve siden altid hentes
// frisk fra serveren.
//
// Det sidste er nødvendigt fordi GitHub Pages beder browseren om at
// gemme siden i ti minutter. Uden det her ville en installeret app
// kunne blive hængende i en gammel udgave, selv efter genstart — og
// så er versionsnummeret nede i hjørnet ikke til at stole på.

self.addEventListener('install',  () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());

self.addEventListener('fetch', event => {
  // Kun selve sidevisningen. Alt andet — skrifttyper, billeder,
  // kald til databasen — må gerne gemmes som normalt.
  if (event.request.mode !== 'navigate') return;

  event.respondWith(
    // 'reload' springer browserens cache over og går direkte til serveren
    fetch(event.request, { cache: 'reload' })
      .catch(() => fetch(event.request))
  );
});

/* =====================================================================
   Push: to hændelser. push viser beskeden, notificationclick åbner
   appen det rigtige sted.
   ===================================================================== */

self.addEventListener("push", event => {
  let d = {};
  try { d = event.data ? event.data.json() : {}; } catch (e) { d = {}; }

  const titel = d.titel || "Vores Hverdag";
  const valg = {
    body: d.tekst || "",
    /* To forskellige ikoner, og de må IKKE være den samme fil.

       icon er det store, farvede til højre i beskeden. Der er appikonet
       det rigtige.

       badge er det lille i statuslinjen, og Android tegner det som en
       SILHUET: alt der ikke er gennemsigtigt, males hvidt. Peger badge
       på appikonet — som den gjorde indtil 6. september 2026 — bliver
       hele den firkantede flade til én hvid klat. icon-badge.png er
       tegnet til formålet: hvid streg på gennemsigtig bund. */
    icon: "./icon-192.png",
    badge: "./icon-badge.png",
    lang: "da",
    /* Samme tag = en ny besked afløser den gamle i stedet for at
       stable sig op. Morgen og aften har hver sit. */
    tag: d.slags === "aften" ? "vh-aften" : "vh-morgen",
    renotify: true,
    data: { url: d.url || "./" }
  };
  event.waitUntil(self.registration.showNotification(titel, valg));
});

self.addEventListener("notificationclick", event => {
  event.notification.close();
  const maal = (event.notification.data && event.notification.data.url) || "./";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true })
      .then(vinduer => {
        /* Står appen allerede åben, så brug den frem for at åbne en til. */
        for (const v of vinduer) {
          if ("focus" in v) {
            if (v.navigate && maal !== "./") { v.navigate(maal).catch(() => {}); }
            return v.focus();
          }
        }
        if (self.clients.openWindow) return self.clients.openWindow(maal);
      })
  );
});
