// Familiekalender — service worker
//
// Der caches med vilje ingenting. Den findes udelukkende for at appen
// kan installeres på hjemmeskærmen. Ville vi cache selve siden, kunne
// du risikere at se en gammel udgave efter en opdatering, og det er
// præcis det versionsnummeret nede i hjørnet skal gøre til at stole på.
// Appen kræver netværk alligevel, siden alt hentes fra databasen.

self.addEventListener('install',  () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());
self.addEventListener('fetch',    () => {});
