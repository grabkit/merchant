// Service Worker for Firebase Cloud Messaging (FCM) Web Push
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// Parse dynamic query parameters passed during registration to match custom configurations
const urlParams = new URLSearchParams(location.search);
const apiKey = urlParams.get('apiKey');
const authDomain = urlParams.get('authDomain');
const projectId = urlParams.get('projectId');
const storageBucket = urlParams.get('storageBucket');
const messagingSenderId = urlParams.get('messagingSenderId');
const appId = urlParams.get('appId');

// Fallback to default demo configuration if no query parameters are provided
const activeFcmConfig = {
    apiKey: apiKey || "AIzaSyFakeKeyPlaceholderForRealFCM",
    authDomain: authDomain || "merchant-ping-soundbox.firebaseapp.com",
    projectId: projectId || "merchant-ping-soundbox",
    storageBucket: storageBucket || "merchant-ping-soundbox.appspot.com",
    messagingSenderId: messagingSenderId || "123456789012",
    appId: appId || "1:123456789012:web:abcdef123456"
};

console.log('[firebase-messaging-sw.js] Initializing with Sender ID:', activeFcmConfig.messagingSenderId);
firebase.initializeApp(activeFcmConfig);

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

