// IMPORTANT: This file should not be used on the client side.
// It is intended for server-side use only (e.g., in Next.js server actions or API routes).

import { initializeApp, getApps, getApp, cert, type App } from 'firebase-admin/app';

// It is crucial to use environment variables for service account credentials
// and not to hardcode them in the source code.
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : undefined;

/**
 * Initializes and returns the Firebase Admin App instance.
 * It ensures that the app is initialized only once (singleton pattern).
 *
 * This function is designed for server-side environments where the Firebase Admin SDK is used.
 *
 * @returns {Promise<App>} A promise that resolves with the initialized Firebase Admin App.
 */
export async function initializeAdminApp(): Promise<App> {
  // If the admin app is already initialized, return it.
  const alreadyInitialized = getApps().find(app => app.name === 'firebase-admin');
  if (alreadyInitialized) {
    return alreadyInitialized;
  }

  if (!serviceAccount) {
    throw new Error('Firebase service account credentials are not set in the environment variables.');
  }
  
  // Initialize the Firebase Admin SDK.
  const adminApp = initializeApp(
    {
      credential: cert(serviceAccount),
    },
    'firebase-admin' // Use a unique name for the admin app instance
  );

  return adminApp;
}
