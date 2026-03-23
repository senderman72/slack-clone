import { useEffect } from "react";
import { auth } from "../../firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      navigate("/channels");
    }
  }, [currentUser]);

  return (
    <div className="login">
      <div className="login-card">
        <div className="login-brand">
          <h1>Pulse</h1>
          <p>Connect and chat in real time</p>
        </div>

        <button
          onClick={async () => {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            navigate("/channels");
          }}
        >
          <FcGoogle className="google" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
