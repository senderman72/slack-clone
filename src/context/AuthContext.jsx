import { createContext, useContext, useState, useEffect, useRef } from "react";
import { auth, db } from "../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

async function upsertUserDoc(user) {
  const userRef = doc(db, "users", user.uid);
  await setDoc(userRef, {
    displayName: user.displayName,
    photoURL: user.photoURL,
    email: user.email,
    lastSeen: serverTimestamp(),
    online: true,
  }, { merge: true });
}

async function setOffline(uid) {
  if (!uid) return;
  const userRef = doc(db, "users", uid);
  try {
    await updateDoc(userRef, { online: false, lastSeen: serverTimestamp() });
  } catch {
    // user doc may not exist yet
  }
}

export default function AuthProvider({ children }) {
  const [fetchingUser, setFetchingUser] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const heartbeatRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setFetchingUser(false);

      // Clear previous heartbeat
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
        heartbeatRef.current = null;
      }

      if (user) {
        await upsertUserDoc(user);

        // Heartbeat every 60s
        heartbeatRef.current = setInterval(() => {
          const userRef = doc(db, "users", user.uid);
          updateDoc(userRef, { lastSeen: serverTimestamp(), online: true }).catch(() => {});
        }, 60000);
      }
    });

    return () => {
      unsubscribe();
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    };
  }, []);

  // Handle tab visibility and unload
  useEffect(() => {
    function handleVisibilityChange() {
      if (!currentUser) return;
      const userRef = doc(db, "users", currentUser.uid);
      if (document.hidden) {
        updateDoc(userRef, { online: false, lastSeen: serverTimestamp() }).catch(() => {});
      } else {
        updateDoc(userRef, { online: true, lastSeen: serverTimestamp() }).catch(() => {});
      }
    }

    function handleBeforeUnload() {
      if (currentUser) {
        // Use sendBeacon-style: fire and forget
        setOffline(currentUser.uid);
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [currentUser]);

  const logOut = async () => {
    if (currentUser) {
      await setOffline(currentUser.uid);
    }
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ currentUser, fetchingUser, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}
