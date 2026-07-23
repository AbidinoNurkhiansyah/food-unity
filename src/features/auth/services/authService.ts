import { auth, db } from '@/config/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import type { UserRole } from '@/features/auth';
import { presenceService } from '@/features/chat/services/presenceService';

// Register with Email
export const registerWithEmail = async (email: string, password: string, name: string, role: UserRole) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Save additional profile data to Firestore
  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    name,
    email,
    role,
    createdAt: new Date().toISOString(),
    profile: {} // Will be completed later
  });

  return { user, role };
};

// Login with Email
export const loginWithEmail = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Fetch role from Firestore
  const userDoc = await getDoc(doc(db, 'users', user.uid));
  const role = userDoc.exists() ? (userDoc.data().role as UserRole) : 'consumer';

  return { user, role };
};

// Login/Register with Google
export const loginWithGoogle = async (defaultRole: UserRole = 'consumer') => {
  const provider = new GoogleAuthProvider();
  // Paksa Google untuk selalu memunculkan jendela "Pilih Akun" meskipun user sudah pernah login sebelumnya
  provider.setCustomParameters({ prompt: 'select_account' });
  const userCredential = await signInWithPopup(auth, provider);
  const user = userCredential.user;

  // Check if user exists in Firestore
  const userDocRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userDocRef);
  
  let role = defaultRole;

  if (!userDoc.exists()) {
    // New Google user, register them
    await setDoc(userDocRef, {
      uid: user.uid,
      name: user.displayName || 'User',
      email: user.email,
      role: defaultRole,
      createdAt: new Date().toISOString(),
      profile: {}
    });
  } else {
    // Existing Google user, get their role
    role = userDoc.data().role as UserRole;
  }

  return { user, role };
};

// Logout
export const logout = async () => {
  const currentUser = auth.currentUser;
  if (currentUser?.uid) {
    await presenceService.setOffline(currentUser.uid);
  }
  await signOut(auth);
};
