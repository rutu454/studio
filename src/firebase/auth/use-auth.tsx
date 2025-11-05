'use client';

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  Auth,
} from 'firebase/auth';
import { useFirebase, useUser as useFirebaseUser } from '@/firebase/provider';

// Re-export useUser for consistency
export const useUser = useFirebaseUser;

export function useAuth() {
  const { auth } = useFirebase();
  const userContext = useFirebaseUser();

  const signInWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will handle the user state update
    } catch (error) {
      console.error('Error signing in with email and password', error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will handle the user state update
    } catch (error) {
      console.error('Error signing up with email and password', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      // onAuthStateChanged will handle the user state update
    } catch (error) {
      console.error('Error signing out', error);
      throw error;
    }
  };

  return {
    ...userContext,
    signInWithEmail,
    signUpWithEmail,
    signOut,
  };
}
