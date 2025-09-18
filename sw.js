self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate',  () => self.clients.claim());
// Valgfrit cache kan komme senere – fetch-pass-through er nok til installbarhed
self.addEventListener('fetch', () => {});
