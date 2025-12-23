// IMPORTANT: This file should not be used on the client side.
// It is intended for server-side use only (e.g., in Next.js server actions or API routes).

import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';

// In a managed environment like Firebase App Hosting or Cloud Functions,
// the SDK can auto-discover credentials. We can provide them via an environment
// variable for local development outside of such environments.
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

  // Initialize the Firebase Admin SDK.
  // If serviceAccount is defined, use it. Otherwise, initialize without arguments
  // to allow for automatic credential discovery in managed environments.
  const adminApp = initializeApp(
    serviceAccount ? { credential: cert(serviceAccount) } : undefined,
    'firebase-admin' // Use a unique name for the admin app instance
  );

  return adminApp;
}
