// Service Worker for GrabKit Merchant Web Push Notifications
self.addEventListener('install', (event) => {
    // Force active state immediately
    self.skipWaiting();
    console.log('[Service Worker] Installed.');
});

self.addEventListener('activate', (event) => {
    // Claim any open clients immediately
    event.waitUntil(clients.claim());
    console.log('[Service Worker] Activated and ready to receive push events.');
});

// Listen to incoming push events from the server
self.addEventListener('push', (event) => {
    console.log('[Service Worker] Push Event received.');
    
    let notificationData = {
        title: 'Store Broadcast Alert',
        body: 'You have a new update from the merchant store.',
        icon: 'https://cdn-icons-png.flaticon.com/512/3119/3119338.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/3119/3119338.png'
    };

    if (event.data) {
        try {
            // If server sends custom JSON
            const parsed = event.data.json();
            notificationData.title = parsed.title || notificationData.title;
            notificationData.body = parsed.body || notificationData.body;
            if (parsed.icon) notificationData.icon = parsed.icon;
        } catch (e) {
            // Or if server sends plain text
            notificationData.body = event.data.text();
        }
    }

    const options = {
        body: notificationData.body,
        icon: notificationData.icon,
        badge: notificationData.badge,
        vibrate: [200, 100, 200],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: '1'
        },
        actions: [
            {
                action: 'open',
                title: 'View Campaign',
                icon: 'https://cdn-icons-png.flaticon.com/512/3119/3119338.png'
            },
            {
                action: 'close',
                title: 'Dismiss'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(notificationData.title, options)
    );
});

// Listen to notification click events (when customer interacts with the notification)
self.addEventListener('notificationclick', (event) => {
    console.log('[Service Worker] Notification click received. Action:', event.action);
    event.notification.close();

    if (event.action === 'close') {
        return;
    }

    // Open/focus the customer webpage when notification is clicked
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then((clientList) => {
            for (const client of clientList) {
                if (client.url && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});
