
import admin from 'firebase-admin';
import { App, getApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const ADMIN_APP_NAME = 'firebase-admin';

function initializeAdminApp(): App {
  // Check if the admin app is already initialized
  if (getApps().some(app => app.name === ADMIN_APP_NAME)) {
    return getApp(ADMIN_APP_NAME);
  }

  // Check for service account credentials from environment variables
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
  
  if (serviceAccount) {
      // In a local or CI/CD environment, use the service account key file
      try {
        const serviceAccountJson = JSON.parse(serviceAccount);
        return admin.initializeApp({
            credential: admin.credential.cert(serviceAccountJson),
        }, ADMIN_APP_NAME);
      } catch (e: any) {
        console.error('Error parsing FIREBASE_SERVICE_ACCOUNT:', e.message);
        // Fall through to try default initialization
      }
  }

  // In a managed environment (like App Hosting), initialize without explicit credentials
  return admin.initializeApp({}, ADMIN_APP_NAME);
}

function getAdminFirestore(app: App) {
    return getFirestore(app);
}

export { initializeAdminApp, getAdminFirestore };
