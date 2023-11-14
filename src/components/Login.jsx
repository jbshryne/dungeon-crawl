import React from "react";

const Login = () => {
  const handleLogin = (event) => {
    event.preventDefault();
    console.log("Login");
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <label htmlFor="username">Username: </label>
        <input type="text" name="username" />
        <label htmlFor="password">Password: </label>
        <input type="password" name="password" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
