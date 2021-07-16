import * as settings from '@polymer/polymer/lib/utils/settings';
import { error } from './console';
import { showToast } from './store/toast/actions';
import { TempAny } from './temp-any';

const SW_URL = 'service-worker.js';
const SCOPE = (settings as TempAny).rootPath;

export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register(SW_URL, {
        scope: SCOPE,
      })
      .then((registration) => {
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;

          installingWorker.onstatechange = () => {
            switch (installingWorker.state) {
              case 'installed':
                if (!navigator.serviceWorker.controller && showToast) {
                  showToast({
                    message: '{$ cachingComplete $}',
                  });
                }
                break;
              case 'redundant':
                throw Error('Service worker telah didaftarkan berkali-kali.');
            }
          };
        };
      })
      .catch((e) => error('Pendaftaran service worker gagal:', e));
  }
};

if (navigator.serviceWorker && navigator.serviceWorker.controller) {
  navigator.serviceWorker.controller.onstatechange = (event) => {
    if ((event.target as ServiceWorker).state === 'redundant') {
      if (showToast) {
        showToast({
          message: '{$ newVersionAvailable $}',
          duration: 5000,
        });
        window.location.reload();
      }
    }
  };
}
