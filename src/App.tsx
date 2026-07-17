import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useAuthStore, type UserRole } from '@/hooks/useAuthStore';

function App() {
  const { setUser } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const role = userDoc.exists() ? (userDoc.data().role as UserRole) : 'consumer';
          setUser(firebaseUser, role);
        } catch (error) {
          console.error("Error fetching user role:", error);
          setUser(firebaseUser, 'consumer');
        }
      } else {
        setUser(null, null);
      }
    });

    return () => unsubscribe();
  }, [setUser]);

  return <RouterProvider router={router} />;
}

export default App;
