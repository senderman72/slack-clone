import React from "react";
import { auth } from "../../firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

export default function Login() {
  console.log(auth.currentUser);
  return (
    <div>
      <button
        onClick={async () => {
          const provider = new GoogleAuthProvider();
          const { user } = await signInWithPopup(auth, provider);
          console.log(user);
        }}
      >
        Log in med google
      </button>
    </div>
  );
}
