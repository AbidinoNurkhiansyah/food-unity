import { rtdb, db } from "@/config/firebase";
import {
  ref,
  onValue,
  onDisconnect,
  set,
  serverTimestamp as rtdbServerTimestamp,
} from "firebase/database";
import { doc, updateDoc, serverTimestamp as firestoreServerTimestamp } from "firebase/firestore";

const presenceCache: Record<string, boolean> = {};

export const presenceService = {
  /**
   * Get cached online status for instant rendering without flicker
   */
  getCachedPresence: (userId: string): boolean => {
    return presenceCache[userId] ?? false;
  },

  /**
   * Set user status to offline before signing out
   */
  setOffline: async (userId: string) => {
    if (!userId) return;
    try {
      presenceCache[userId] = false;
      const userStatusRef = ref(rtdb, `status/${userId}`);
      const userDocRef = doc(db, "users", userId);

      await set(userStatusRef, {
        state: "offline",
        lastChanged: rtdbServerTimestamp(),
      });

      await updateDoc(userDocRef, {
        isOnline: false,
        lastActive: firestoreServerTimestamp(),
      }).catch(() => {});
    } catch (err) {
      console.warn("Error setting user offline:", err);
    }
  },

  /**
   * Track online/offline status for logged in user in Realtime Database & Firestore
   */
  setupPresence: (userId: string) => {
    if (!userId) return () => {};

    try {
      const connectedRef = ref(rtdb, ".info/connected");
      const userStatusRef = ref(rtdb, `status/${userId}`);
      const userDocRef = doc(db, "users", userId);

      const unsubscribe = onValue(connectedRef, (snap) => {
        if (snap.val() === false) {
          return;
        }

        // Setup onDisconnect cleanup on Firebase server (triggers automatically if tab/browser closes or network drops)
        onDisconnect(userStatusRef)
          .set({
            state: "offline",
            lastChanged: rtdbServerTimestamp(),
          })
          .then(() => {
            presenceCache[userId] = true;
            // Set online status in RTDB while connected
            set(userStatusRef, {
              state: "online",
              lastChanged: rtdbServerTimestamp(),
            });

            // Mirror to Firestore for cross-querying
            updateDoc(userDocRef, {
              isOnline: true,
              lastActive: firestoreServerTimestamp(),
            }).catch(() => {});
          })
          .catch((err) => {
            console.warn("RTDB onDisconnect warning:", err);
          });
      });

      return () => {
        unsubscribe();
      };
    } catch (err) {
      console.warn("Presence setup fallback active:", err);
      return () => {};
    }
  },

  /**
   * Subscribe to another user's online/offline status in real-time
   */
  subscribeUserPresence: (
    userId: string,
    callback: (isOnline: boolean, lastChanged?: any) => void
  ) => {
    if (!userId) {
      callback(false);
      return () => {};
    }

    // Immediately invoke callback with cached presence if available to prevent flicker
    if (userId in presenceCache) {
      callback(presenceCache[userId]);
    }

    try {
      const userStatusRef = ref(rtdb, `status/${userId}`);
      const unsubscribe = onValue(
        userStatusRef,
        (snapshot) => {
          const val = snapshot.val();
          const isOnline = val ? val.state === "online" : false;
          presenceCache[userId] = isOnline;
          callback(isOnline, val?.lastChanged);
        },
        (error) => {
          console.warn("Error reading user presence:", error);
          presenceCache[userId] = false;
          callback(false);
        }
      );

      return unsubscribe;
    } catch (err) {
      console.warn("Presence subscription fallback:", err);
      presenceCache[userId] = false;
      callback(false);
      return () => {};
    }
  },
};
