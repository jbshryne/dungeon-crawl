import React, { useState } from "react";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [signupStatus, setSignupStatus] = useState("Signup currently disabled");

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
      setSignupStatus("SUCCESS! You can now login");
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
    <div className="auth-component">
      <h1>{signupStatus}</h1>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleInputChange}
          disabled={true}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleInputChange}
          disabled={true}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          onChange={handleInputChange}
          disabled={true}
        />
        <button type="submit" disabled={true}>
          Signup
        </button>
      </form>
    </div>
  );
};

export default Signup;
