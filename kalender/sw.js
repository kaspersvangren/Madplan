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
