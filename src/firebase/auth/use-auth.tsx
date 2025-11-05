'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  signInWithEmailAndPassword as firebaseSignIn,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useFirebase, useUser as useFirebaseUser } from '@/firebase/provider';
import { FirestorePermissionError } from '@/firebase/errors';
import { errorEmitter } from '@/firebase/error-emitter';

// Re-export useUser from provider for components to get the basic user object
export { useFirebaseUser as useUser };

export function useAuth() {
  const { auth, firestore, user, isUserLoading, userError } = useFirebase();
  const [isAdmin, setIsAdmin] = useState<boolean | undefined>(undefined);

  const checkAdminStatus = useCallback(async () => {
    // If there's no user or firestore instance, they can't be an admin.
    if (!user || !firestore) {
      setIsAdmin(false);
      return;
    }

    // Set admin status to "checking"
    setIsAdmin(undefined);
    const adminDocRef = doc(firestore, `admin_users/${user.uid}`);
    
    try {
      const docSnap = await getDoc(adminDocRef);
      // Set admin status based on whether the document exists.
      setIsAdmin(docSnap.exists());
    } catch (error) {
      // If there's any error (e.g., permissions), they are not an admin.
      setIsAdmin(false);
      console.error("Error checking admin status:", error);

      // Specifically handle permission denied errors by emitting a contextual error.
      if (error instanceof Error && (error.message.includes('permission-denied') || error.message.includes('insufficient permissions'))) {
        const permissionError = new FirestorePermissionError({
          path: adminDocRef.path,
          operation: 'get',
        });
        errorEmitter.emit('permission-error', permissionError);
      }
    }
  }, [user, firestore]);

  // This effect runs whenever the user object changes (e.g., on login/logout).
  useEffect(() => {
    // If the user object is present, check their admin status.
    // If the user is null, they are not an admin.
    if (user) {
      checkAdminStatus();
    } else {
      setIsAdmin(false);
    }
  }, [user, checkAdminStatus]);

  const signInWithEmailAndPassword = (email: string, password: string) => {
    if (!auth) throw new Error("Firebase Auth not initialized");
    return firebaseSignIn(auth, email, password);
  };

  const signOut = async () => {
    if (!auth) throw new Error("Firebase Auth not initialized");
    await firebaseSignOut(auth);
    setIsAdmin(false); // Explicitly set admin to false on sign out.
  };

  return {
    user,
    isUserLoading,
    userError,
    isAdmin, // This will be `undefined` during check, `true` or `false` after.
    signInWithEmailAndPassword,
    signOut,
  };
}
