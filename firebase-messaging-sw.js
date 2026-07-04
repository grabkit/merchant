// Service Worker for Firebase Cloud Messaging (FCM) Web Push
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// Default Demo Configuration fallback so service worker doesn't crash on start
const defaultFcmConfig = {
    apiKey: "AIzaSyFakeKeyPlaceholderForRealFCM",
    authDomain: "merchant-ping-soundbox.firebaseapp.com",
    projectId: "merchant-ping-soundbox",
    storageBucket: "merchant-ping-soundbox.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef123456"
};

firebase.initializeApp(defaultFcmConfig);

const messaging = firebase.messaging();

// Customize background message handling
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);

    const notificationTitle = payload.notification?.title || 'Store Broadcast Alert';
    const notificationOptions = {
        body: payload.notification?.body || 'You have a new update from the merchant store.',
        icon: payload.notification?.icon || 'https://cdn-icons-png.flaticon.com/512/3119/3119338.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/3119/3119338.png',
        data: payload.data || {}
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
