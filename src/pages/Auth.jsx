import React, { useState } from "react";
import Login from "../components/Login";
import Signup from "../components/Signup";

const Auth = () => {
  const [component, setComponent] = useState("login");

  const handleComponentChange = (event) => {
    setComponent(event.target.name);
  };

  return (
    <div>
      <button onClick={handleComponentChange} name="login">
        Sign In
      </button>
      <button onClick={handleComponentChange} name="signup">
        Create a New Account
      </button>
      {component === "login" ? <Login /> : <Signup />}
    </div>
  );
};

export default Auth;
