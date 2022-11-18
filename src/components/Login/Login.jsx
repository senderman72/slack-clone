import React from "react";
import { auth } from "../../firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import "./Login.css";

export default function Login() {
  console.log(auth.currentUser);
  return (
    <div className="login">
      <h1>Welcome to my slack clone</h1>
      <button
        onClick={async () => {
          const provider = new GoogleAuthProvider();
          const { user } = await signInWithPopup(auth, provider);

          console.log(user);
        }}
      >
        Log in with Google
      </button>
    </div>
  );
}
