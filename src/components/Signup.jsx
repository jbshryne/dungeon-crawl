import React, { useState } from "react";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [signupStatus, setSignupStatus] = useState(null);

  const handleSignup = async (event) => {
    event.preventDefault();

    console.log(formData);

    if (formData.username === "") {
      setSignupStatus("Please enter a username!");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setSignupStatus("Passwords do not match!");
      return;
    }

    const response = await fetch(`${process.env.REACT_APP_API_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: formData.username,
        password: formData.password,
      }),
    });

    console.log(response);

    if (response.ok) {
      setSignupStatus("You can now login!");
    } else {
      setSignupStatus("Something went wrong...");
    }
  };

  const handleInputChange = (event) => {
    setFormData((currentFormData) => {
      return {
        ...currentFormData,
        [event.target.name]: event.target.value,
      };
    });
  };

  return (
    <div>
      <h1>Signup</h1>
      <form onSubmit={handleSignup}>
        <label htmlFor="username">Username: </label>
        <input type="text" name="username" onChange={handleInputChange} />
        <label htmlFor="password">Password: </label>
        <input type="password" name="password" onChange={handleInputChange} />
        <label htmlFor="confirmPassword">Confirm Password: </label>
        <input
          type="password"
          name="confirmPassword"
          onChange={handleInputChange}
        />
        <button type="submit">Signup</button>
      </form>
      <p>{signupStatus}</p>
    </div>
  );
};

export default Signup;
