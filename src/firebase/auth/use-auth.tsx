'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  signInWithEmailAndPassword as firebaseSignIn,
  signOut as firebaseSignOut,
  Auth,
} from 'firebase/auth';
import { doc, getDoc, Firestore } from 'firebase/firestore';
import { useFirebase, useUser as useFirebaseUser } from '@/firebase/provider';
import { FirestorePermissionError } from '@/firebase/errors';
import { errorEmitter } from '@/firebase/error-emitter';

// Re-export useUser from provider for components to get the basic user object
export const useUser = useFirebaseUser;

export function useAuth() {
  const { auth, firestore, user, isUserLoading, userError } = useFirebase();
  const [isAdmin, setIsAdmin] = useState<boolean | undefined>(undefined); // undefined means "still checking"

  const checkAdminStatus = useCallback(async () => {
    if (!user || !firestore) {
      setIsAdmin(false); // No user or firestore, so can't be admin
      return;
    }

    setIsAdmin(undefined); // Start check
    const adminDocRef = doc(firestore, `admin_users/${user.uid}`);
    
    try {
      const docSnap = await getDoc(adminDocRef);
      setIsAdmin(docSnap.exists());
    } catch (error) {
      setIsAdmin(false);
      console.error("Error checking admin status:", error);
       if (error instanceof Error && error.message.includes('permission-denied')) {
        const permissionError = new FirestorePermissionError({
          path: adminDocRef.path,
          operation: 'get',
        });
        errorEmitter.emit('permission-error', permissionError);
       }
    }
  }, [user, firestore]);

  useEffect(() => {
    checkAdminStatus();
  }, [checkAdminStatus]);

  const signInWithEmailAndPassword = (email: string, password: string) => {
    return firebaseSignIn(auth, email, password);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setIsAdmin(false); // Reset admin status on sign out
  };

  return {
    user,
    isUserLoading,
    userError,
    isAdmin,
    signInWithEmailAndPassword,
    signOut,
  };
}
