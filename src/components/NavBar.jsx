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
        <span>Dungeon Throwdown</span>
      </Link>
      <section>
        <Link to="/game" className="nav-bar-item">
          <span>Game</span>
        </Link>
        <Link to="/rules" className="nav-bar-item">
          {" "}
          <span>How to Play</span>
        </Link>
        {isLoggedIn ? (
          <span
            className="nav-bar-item"
            onClick={handleLogout}
            style={{ cursor: "pointer" }}
          >
            Logout
          </span>
        ) : (
          <Link to="/auth" className="nav-bar-item">
            <span>Login</span>
          </Link>
        )}
      </section>
    </div>
  );
};

export default NavBar;
