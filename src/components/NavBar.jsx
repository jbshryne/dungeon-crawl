import React from "react";
import { Link, useNavigate } from "react-router-dom";

const NavBar = () => {
  const isLoggedIn = JSON.parse(localStorage.getItem("currentUser"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/auth");
  };

  return (
    <div className="nav-bar">
      <Link to="/" className="nav-bar-item">
        <span className="hero-title">Dungeon Throwdown</span>
      </Link>
      <section>
        <Link to="/game" className="nav-bar-item">
          <span>PLAY GAME</span>
        </Link>
        <Link to="/select" className="nav-bar-item">
          <span>MULTIPLAYER</span>
        </Link>
        <Link to="/rules" className="nav-bar-item">
          <span>HOW TO PLAY</span>
        </Link>
        {isLoggedIn ? (
          <span
            className="nav-bar-item"
            onClick={handleLogout}
            style={{ cursor: "pointer" }}
          >
            LOGOUT
          </span>
        ) : (
          <Link to="/auth" className="nav-bar-item">
            <span>LOGIN</span>
          </Link>
        )}
      </section>
    </div>
  );
};

export default NavBar;
