import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useAuthStore, type UserRole } from '@/features/auth';
import { Toaster } from '@/components/ui/sonner';

import { presenceService } from '@/features/chat/services/presenceService';

function App() {
  const { setUser } = useAuthStore();

  useEffect(() => {
    let cleanupPresence: (() => void) | null = null;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (cleanupPresence) {
        cleanupPresence();
        cleanupPresence = null;
      }

      if (firebaseUser) {
        // Prevent setting unverified email/password users to global state
        if (!firebaseUser.emailVerified && firebaseUser.providerData?.some(p => p.providerId === 'password')) {
          setUser(null, null);
          return;
        }

        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (!userDoc.exists()) {
            // Document hasn't been created yet (e.g. midway through Google registration)
            // or the user was deleted/invalid. Ignore for now.
            // The registration/login flow will manually call setUser once the doc is ready.
            setUser(null, null);
            return;
          }
          
          const userData = userDoc.data();
          const role = userData ? (userData.role as UserRole) : 'consumer';
          const isProfileCompleted = userData?.profile?.isCompleted ?? false;
          setUser(firebaseUser, role, isProfileCompleted);
        } catch (error) {
          console.error("Error fetching user role:", error);
          setUser(null, null);
        }

        // Setup Realtime Database Presence (Online/Offline)
        cleanupPresence = presenceService.setupPresence(firebaseUser.uid);
      } else {
        setUser(null, null);
      }
    });

    return () => {
      if (cleanupPresence) cleanupPresence();
      unsubscribe();
    };
  }, [setUser]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;
