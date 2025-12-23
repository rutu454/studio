'use server';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeAdminApp } from '@/firebase/admin-init';

// Helper function to initialize the admin app
async function getAdminServices() {
  const adminApp = await initializeAdminApp();
  return {
    auth: getAuth(adminApp),
    firestore: getFirestore(adminApp),
  };
}

export async function login(email: string, password: string): Promise<{ error: string | null }> {
  try {
    const { auth } = await getAdminServices();
    // This is a placeholder for a real sign-in flow.
    // In a real app, you would sign in the user and get an ID token.
    // For this example, we're not implementing a full session management.
    // We are just checking if the user can be conceptually signed in.
    // The `signInWithEmailAndPassword` is a client-side function, so we simulate a check here.
    // A more robust server-side check would involve custom tokens.
    const userRecord = await auth.getUserByEmail(email);

    // This is NOT a real password check. Firebase Admin SDK cannot verify passwords.
    // This is a significant simplification for the prototype.
    // A real implementation requires client-side sign-in and sending the ID token to the server.
    if (userRecord) {
        // In a real app, you'd set a session cookie here.
        return { error: null };
    }
    return { error: 'Invalid credentials.' };

  } catch (error: any) {
    if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        return { error: 'Invalid email or password.' };
    }
    console.error('Login error:', error);
    return { error: 'An unexpected error occurred. Please try again.' };
  }
}

export async function registerAdmin(email: string, password: string): Promise<{ error: string | null }> {
    try {
        const { auth, firestore } = await getAdminServices();

        // 1. Create user in Firebase Authentication
        const userRecord = await auth.createUser({
            email,
            password,
        });

        // 2. Save user data to Firestore in 'admin_user' collection
        await firestore.collection('admin_user').doc(userRecord.uid).set({
            uid: userRecord.uid,
            email: userRecord.email,
            role: 'admin',
            createdAt: new Date().toISOString(),
        });

        return { error: null };
    } catch (error: any) {
        if (error.code === 'auth/email-already-exists') {
            return { error: 'An account with this email already exists.' };
        }
        console.error('Registration error:', error);
        return { error: 'An unexpected error occurred during registration.' };
    }
}
