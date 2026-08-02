import { auth, db } from '@/config/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup,
  sendEmailVerification,
  sendPasswordResetEmail
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
    profile: {
      isCompleted: false
    }
  });

  // Send Email Verification
  await sendEmailVerification(user);

  // Logout immediately to prevent auto-login before verification
  await signOut(auth);

  return { user, role, isCompleted: false };
};

// Login with Email
export const loginWithEmail = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  if (!user.emailVerified) {
    // Optional: sendEmailVerification(user) here if you want to resend automatically
    await signOut(auth);
    const error = new Error('Email not verified. Please check your inbox.');
    (error as any).code = 'auth/email-not-verified';
    throw error;
  }

  // Fetch role & profile completion status from Firestore
  const userDoc = await getDoc(doc(db, 'users', user.uid));
  const userData = userDoc.exists() ? userDoc.data() : null;
  const role = userData ? (userData.role as UserRole) : 'consumer';
  const isCompleted = userData?.profile?.isCompleted ?? false;

  return { user, role, isCompleted };
};

// Login/Register with Google
export const loginWithGoogle = async (defaultRole: UserRole = 'consumer', isLoginOnly = false) => {
  const provider = new GoogleAuthProvider();
  // Force Google to always show the "Select Account" prompt even if the user has logged in before
  provider.setCustomParameters({ prompt: 'select_account' });
  const userCredential = await signInWithPopup(auth, provider);
  const user = userCredential.user;

  // Check if user exists in Firestore
  const userDocRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userDocRef);
  
  let role = defaultRole;
  let isCompleted = false;

  if (!userDoc.exists()) {
    if (isLoginOnly) {
      // If they are trying to log in but don't have an account, block it.
      await user.delete().catch(async () => {
        // Fallback to sign out if delete fails (e.g., due to reauthentication required, though rare for just created users)
        await signOut(auth);
      });
      const error = new Error('Account not found. Please register first.');
      (error as any).code = 'auth/user-not-found';
      throw error;
    }

    // New Google user (from registration flow), register them
    await setDoc(userDocRef, {
      uid: user.uid,
      name: user.displayName || 'User',
      email: user.email,
      role: defaultRole,
      createdAt: new Date().toISOString(),
      profile: {
        isCompleted: false
      }
    });
  } else {
    // Existing Google user, get their role & profile completion status
    const userData = userDoc.data();
    role = userData.role as UserRole;
    isCompleted = userData.profile?.isCompleted ?? false;
  }

  return { user, role, isCompleted };
};

// Reset Password
export const resetPassword = async (email: string) => {
  await sendPasswordResetEmail(auth, email);
};

// Logout
export const logout = async () => {
  const currentUser = auth.currentUser;
  if (currentUser?.uid) {
    await presenceService.setOffline(currentUser.uid);
  }
  await signOut(auth);
};
