'use client';

import { useContext } from 'react';
import { FirebaseContext } from '@/firebase/provider';
import type { User } from 'firebase/auth';

export interface UseUserResult {
  user: User | null;
  isUserLoading: boolean;
}

export const useUser = (): UseUserResult => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a FirebaseProvider.');
  }
  return {
    user: context.user,
    isUserLoading: context.isUserLoading,
  };
};
