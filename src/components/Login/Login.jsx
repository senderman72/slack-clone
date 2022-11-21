import React from "react";
import { auth } from "../../firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { Slack } from "react-feather";
import { useNavigate } from "react-router-dom";

import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  if (auth.currentUser) {
    navigate("/channels");
    return <></>;
  }

  console.log(auth.currentUser);
  return (
    <div className="login">
      <h1>
        Welcome to my slack clone <Slack />
      </h1>

      <button
        onClick={async () => {
          const provider = new GoogleAuthProvider();
          const { user } = await signInWithPopup(auth, provider);
          navigate("*");

          console.log(user);
        }}
      >
        <h3>
          Sign in with Google <FcGoogle className="google" />
        </h3>
      </button>
    </div>
  );
}
