'use client';

import { useState } from 'react';
import {
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { useFirebase, useUser as useFirebaseUser } from '@/firebase/provider';

// Re-export useUser for consistency, though it's less critical now
export const useUser = useFirebaseUser;

// A simple in-memory state for manual sign-in
let memoryIsSignedIn = false;

export function useAuth() {
  const { auth, isUserLoading: isFirebaseUserLoading } = useFirebase();
  // This state is just to trigger re-renders in components using the hook
  const [isManuallySignedIn, setIsManuallySignedIn] = useState(memoryIsSignedIn);

  const manualSignIn = () => {
    memoryIsSignedIn = true;
    setIsManuallySignedIn(true);
  };

  const manualSignOut = () => {
    memoryIsSignedIn = false;
    setIsManuallySignedIn(false);
  };

  const signOut = async () => {
    manualSignOut(); // Sign out from our manual state
    try {
      if (auth.currentUser) {
        await firebaseSignOut(auth); // Also sign out from Firebase if a user exists
      }
    } catch (error) {
      console.error('Error signing out from Firebase', error);
    }
  };

  return {
    isManuallySignedIn,
    isUserLoading: isFirebaseUserLoading, // We can still use Firebase's initial loading state
    manualSignIn,
    signOut, // Use this for logout
  };
}
