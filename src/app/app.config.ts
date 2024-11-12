import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'ring-of-fire-e5661',
        appId: '1:576582816460:web:97fdee93d48fbc0f16e869',
        storageBucket: 'ring-of-fire-e5661.firebasestorage.app',
        apiKey: 'AIzaSyD4hLkEC0HA7q7Qw05fAu-cfremhsEjtRc',
        authDomain: 'ring-of-fire-e5661.firebaseapp.com',
        messagingSenderId: '576582816460',
      })
    ),
    provideFirestore(() => getFirestore()),
  ],
};
