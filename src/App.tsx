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
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const role = userDoc.exists() ? (userDoc.data().role as UserRole) : 'consumer';
          setUser(firebaseUser, role);
        } catch (error) {
          console.error("Error fetching user role:", error);
          setUser(firebaseUser, 'consumer');
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
