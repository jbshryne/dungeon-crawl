import React from "react";

const Signup = () => {
  const handleSignup = (event) => {
    event.preventDefault();
    console.log("Signup");
  };

  return (
    <div>
      <h1>Signup</h1>
      <form onSubmit={handleSignup}>
        <label htmlFor="username">Username: </label>
        <input type="text" name="username" />
        <label htmlFor="password">Password: </label>
        <input type="password" name="password" />
        <label htmlFor="password">Confirm Password: </label>
        <input type="password" name="password" />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
