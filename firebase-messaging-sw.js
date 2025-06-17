importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js');

firebase.initializeApp({
  apiKey: "AIzaSyDAYD7DhRovj0PYHUSpOq5YE1rQXIiOPkc",
  authDomain: "chat-trader.firebaseapp.com",
  projectId: "chat-trader",
  storageBucket: "chat-trader.firebasestorage.app",
  messagingSenderId: "722204996123",
  appId: "1:722204996123:web:6ab7fd6a6b5646c3e0bebe",
  measurementId: "G-N36TE38K29"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  console.log('[firebase-messaging-sw.js] Mensagem recebida no background ', payload);

  const notificationTitle = payload.notification.title || 'Nova mensagem do Chat Trader';
  const notificationOptions = {
    body: payload.notification.body || 'Você tem uma nova notificação.',
    icon: payload.notification.icon || '/icon-192x192.png', // seu ícone padrão aqui
    badge: '/badge-72x72.png', // opcional, se tiver
    vibrate: [100, 50, 100],
    actions: [
      {
        action: 'open_chat',
        title: 'Abrir Chat',
        icon: '/chat-icon.png'
      }
    ],
    data: {
      urlToOpen: 'https://jesus3x.github.io/Chat-trader/' // link para abrir ao clicar na notificação
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Evento para tratar clique na notificação
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const urlToOpen = event.notification.data.urlToOpen;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      // Se já existir uma aba aberta com o app, foca nela
      for (const client of windowClients) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // Se não, abre uma nova aba
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
