import React, { useEffect, useState } from "react";
import Login from "../components/Login";
import Signup from "../components/Signup";

const Auth = () => {
  const [component, setComponent] = useState(<Login />);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    if (currentUser) setIsLoggedIn(true);
  }, [currentUser]);

  const handleComponentChange = (event) => {
    if (event.target.name === "login") setComponent(<Login />);
    if (event.target.name === "signup") setComponent(<Signup />);
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setIsLoggedIn(false);
  };

  return (
    <div>
      {isLoggedIn ? (
        <>
          <p>You are currently signed in as {currentUser.username}</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <button onClick={handleComponentChange} name="login">
            Sign In
          </button>
          <button onClick={handleComponentChange} name="signup">
            Create a New Account
          </button>
          {component}
        </>
      )}
    </div>
  );
};

export default Auth;
