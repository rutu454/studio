'use client';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { useAuth as useFirebaseAuth } from '@/firebase';

export function useAuth() {
  const auth = useFirebaseAuth();

  const signup = async (name: string, email: string, password: string) => {
    if (!auth) throw new Error('Firebase Auth not initialized');
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await updateProfile(userCredential.user, { displayName: name });
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
