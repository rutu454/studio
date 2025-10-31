'use client';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { useAuth as useFirebaseAuth, useFirestore } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { setDocumentNonBlocking } from '../non-blocking-updates';

export function useAuth() {
  const auth = useFirebaseAuth();
  const firestore = useFirestore();

  const signup = async (name: string, email: string, password: string, contactNumber?: string) => {
    if (!auth || !firestore) throw new Error('Firebase not initialized');
    
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Update Firebase Auth profile
    await updateProfile(user, { displayName: name });

    // Create user document in Firestore
    const userDocRef = doc(firestore, 'users', user.uid);
    const initials = name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();

    const firestoreData: any = {
      id: user.uid,
      fullName: name,
      email: user.email,
      initials: initials,
      createdAt: serverTimestamp(),
    };

    if (contactNumber) {
      firestoreData.contactNumber = contactNumber;
    }

    setDocumentNonBlocking(userDocRef, firestoreData, { merge: true });

    return userCredential;
  };

  const login = (email: string, password: string) => {
    if (!auth) throw new Error('Firebase Auth not initialized');
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    if (!auth) throw new Error('Firebase Auth not initialized');
    return signOut(auth);
  };

  return { signup, login, logout };
}
