import React from "react";
import { auth, provider } from "../config/firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./login.scss";
import GoogleIcon from "@mui/icons-material/Google";
import { IconButton } from "@mui/material";

const Login = () => {
  const navigate = useNavigate();
  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, provider);
    navigate("/");
  };
  return (
    <div id="gSignInWrapper">
      <span className="label">Войдите чтобы писать посты и лайкать:</span>
      <div id="customBtn" className="customGPlusSignIn">
        <IconButton color="success" size="large">
          <GoogleIcon />
        </IconButton>
        <button onClick={signInWithGoogle}>Войти с Google</button>
      </div>
    </div>
  );
};

export default Login;
