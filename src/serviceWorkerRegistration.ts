// Service Worker Registration for Cartório do Amor PWA

export function registerServiceWorker(onUpdate?: (registration: ServiceWorkerRegistration) => void) {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    if (import.meta.env.DEV) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const reg of registrations) {
          reg.unregister();
        }
      });
      if ('caches' in window) {
        caches.keys().then((names) => {
          names.forEach((name) => caches.delete(name));
        });
      }
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = '/sw.js';

      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          console.log('[PWA] Service Worker registrado com sucesso! Escopo:', registration.scope);

          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker == null) return;

            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  console.log('[PWA] Novo conteúdo disponível; por favor atualize.');
                  if (onUpdate) onUpdate(registration);
                } else {
                  console.log('[PWA] Conteúdo em cache para uso offline!');
                }
              }
            };
          };
        })
        .catch((error) => {
          console.error('[PWA] Erro ao registrar Service Worker:', error);
        });
    });
  }
}

export function unregisterServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}
