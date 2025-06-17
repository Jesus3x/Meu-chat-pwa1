importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js');

firebase.initializeApp({
  apiKey: "AIzaSyAb3NOMIUO-zQ9QaGIXwV8ty38cN9Yl2Gg",
  authDomain: "chat-on-1-4f38f.firebaseapp.com",
  databaseURL: "https://chat-on-1-4f38f-default-rtdb.firebaseio.com",
  projectId: "chat-on-1-4f38f",
  storageBucket: "chat-on-1-4f38f.firebasestorage.app",
  messagingSenderId: "499742357573",
  appId: "1:499742357573:web:ea19d23862b1104db74b2c",
  measurementId: "G-442TLFZD05"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  console.log('[firebase-messaging-sw.js] Mensagem recebida no background ', payload);

  const notificationTitle = payload.notification.title || 'Nova mensagem do Chat';
  const notificationOptions = {
    body: payload.notification.body || 'Você tem uma nova notificação.',
    icon: payload.notification.icon || '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [100, 50, 100],
    actions: [
      {
        action: 'open_chat',
        title: 'Abrir Chat',
        icon: '/chat-icon.png'
      }
    ],
    data: {
      urlToOpen: 'https://seu-site-ou-app.com/' // ajuste para seu link real
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const urlToOpen = event.notification.data.urlToOpen;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      for (const client of windowClients) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
