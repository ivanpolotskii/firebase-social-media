import React from "react";
import { Link, Navigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import {useNavigate} from "react-router-dom"
import "./navbar.scss"

const Navbar = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  const signUserOut = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="navbar">
      <div className="links">
        <Link to="/">Домой</Link>
        {user ? (
          <Link to="/createpost">Постить</Link>
        ) : (
          <Link to="/login">Вход</Link>
        )}
      </div>
      <div className="user">
        {/* <p>{user?.displayName}</p> */}
        {user?.photoURL && <img src={user?.photoURL || ""} alt="" />}
        {user && <button className="logout-button" onClick={signUserOut}>Выйти</button>}
      </div>
    </div>
  );
};

export default Navbar;
